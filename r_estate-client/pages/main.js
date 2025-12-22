import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, Button, Box, CircularProgress, Stack, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import Properties from '../components/Properties';
import AuthNavbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import QueryInput from '../components/QueryInput';
import NoAuthNavbar from '../components/NoAuthNavbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSession } from 'next-auth/react';
import { useProperty } from '../context/PropertyContext';
import axios from 'axios';
import { useMarketplace } from '../context/MarketplaceContext';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ethers } from "ethers";

const cityList = [
    { value: 'hanoi', label: 'Hà Nội' }, 
    { value: 'hcm', label: 'TP. Hồ Chí Minh' }, 
    { value: 'danang', label: 'Đà Nẵng' }, 
    { value: 'nhatrang', label: 'Nha Trang' }, 
    { value: 'dalat', label: 'Đà Lạt' }
];

const typeList = [
    { value: 'apartment', label: 'Căn hộ' },
    { value: 'villa', label: 'Biệt thự' },
    { value: 'bungalow', label: 'Nhà gỗ' },
    { value: 'penthouse', label: 'Penthouse' },
];

const Main = () => {
    const [NFTs, setNFTs] = useState([]);
    const [NFTsCopy, setNFTsCopy] = useState([]);
    const [loading, setLoading] = useState(true);

    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();
    const { t } = useTranslation();
    const { data: session, status } = useSession();
    const { handleSubmit, control, reset } = useForm({
        defaultValues: { cityName: '', propertyType: '' }
    });

    useEffect(() => {
        if (marketplace && propertyContract) {
            loadNFTs();
        }
    }, [marketplace, propertyContract]);

    const handleCancelListing = async (listingId) => {
        try {
            const tx = await marketplace.cancelListing(listingId);
            await tx.wait();
            loadNFTs();
        } catch (error) {
            console.error("Lỗi khi hủy:", error);
        }
    };

    const loadNFTs = async () => {
    try {
        setLoading(true);
        const data = await marketplace.getAllListings();
        
        const items = await Promise.all(
            data.map(async (nft) => {
                try {
                    const tokenURI = await propertyContract.tokenURI(nft.tokenId);
                    
                    // Xử lý link Gateway IPFS
                    const gatewayUrl = tokenURI.startsWith('http') 
                        ? tokenURI 
                        : `https://gateway.lighthouse.storage/ipfs/${tokenURI}`;

                    const metadataResponse = await axios.get(gatewayUrl);
                    const mData = metadataResponse.data;

                    // Hàm helper lấy giá trị attribute từ metadata
                    const getAttr = (type) => mData.attributes?.find(a => a.trait_type === type)?.value || "";

                    return {
                        listingId: nft.listingId.toNumber(),
                        tokenId: nft.tokenId.toNumber(),
                        seller: nft.seller,
                        price: ethers.utils.formatEther(nft.price),
                        
                        // Thông tin cơ bản
                        title: mData.name || "Chưa đặt tên", 
                        // overview lấy từ description (Nơi chứa mô tả chi tiết chúng ta vừa gộp)
                        overview: mData.description || "Không có mô tả",
                        image: mData.image || 'https://via.placeholder.com/400x300?text=No+Image',
                        allImages: mData.allImages || [], // Lấy thêm mảng ảnh nếu có

                        // Thông số kỹ thuật (Attributes)
                        location: getAttr("Location") || "N/A",
                        propertyType: getAttr("Property Type") || "N/A",
                        areaSize: getAttr("Area Size") || "0",
                        bedroomNum: getAttr("Bedrooms") || "0",
                        bathroomNum: getAttr("Bathrooms") || "0",
                        pool: getAttr("Pool") || "no",
                    };
                } catch (err) {
                    console.error(`Lỗi load NFT #${nft.tokenId}:`, err);
                    return null;
                }
            })
        );

        const finalItems = items.filter(i => i !== null);
        setNFTs(finalItems);
        setNFTsCopy(finalItems);
    } catch (error) {
        console.error("Lỗi tổng quát loadNFTs:", error);
    } finally {
        setLoading(false);
    }
};

    const onSubmit = (queryForm) => {
        const filtered = NFTsCopy.filter((nft) => {
            const matchType = queryForm.propertyType ? nft.propertyType.toLowerCase() === queryForm.propertyType.toLowerCase() : true;
            const matchCity = queryForm.cityName ? nft.location.toLowerCase() === queryForm.cityName.toLowerCase() : true;
            return matchType && matchCity;
        });
        setNFTs(filtered);
    };

    const resetQuery = () => {
        reset({ cityName: '', propertyType: '' });
        setNFTs(NFTsCopy);
    };

    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" 
                sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <CircularProgress sx={{ color: '#2D3436', mb: 2 }} />
                <Typography sx={{ color: '#636e72', fontWeight: 600 }}>Khám phá thị trường bất động sản...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
            
        }}>
            {status === 'unauthenticated' ? <NoAuthNavbar page="main" /> : <AuthNavbar />}
            
            {/* Hero & Search Section */}
            <Box sx={{ 
                pt: 18, pb: 10, 
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at top right, #e0e7ff 0%, transparent 40%), radial-gradient(circle at bottom left, #f1f5f9 0%, transparent 40%)'
            }}>
                <Container maxWidth="lg">
                    <Stack spacing={4} alignItems="center" textAlign="center">
                        <Box>
                            <Chip label="Sàn giao dịch BĐS Blockchain" color="primary" sx={{ mb: 2, fontWeight: 700, bgcolor: '#4F46E5' }} />
                            <Typography variant="h2" sx={{ fontWeight: 900, color: '#1E293B', mb: 2, letterSpacing: '-0.02em' }}>
                                Tìm kiếm nơi an cư lý tưởng
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748B', maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                                Minh bạch, an toàn và nhanh chóng với công nghệ chuỗi khối hàng đầu.
                            </Typography>
                        </Box>

                        {/* Search Bar Glassmorphism */}
                        <Paper elevation={0} sx={{ 
                            p: 2, 
                            width: '100%',
                            maxWidth: 1000,
                            borderRadius: '24px', 
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
                        }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name='cityName'
                                            control={control}
                                            render={({ field }) => <QueryInput field={field} queryName="Vị trí (Thành phố)" options={cityList} />} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name='propertyType'
                                            control={control}
                                            render={({ field }) => <QueryInput field={field} queryName="Loại hình nhà ở" options={typeList} />} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack direction="row" spacing={1} sx={{ height: 56 }}>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                fullWidth 
                                                startIcon={<SearchIcon />}
                                                sx={{ borderRadius: '16px', bgcolor: '#1E293B', '&:hover': { bgcolor: '#000' }, textTransform: 'none', fontSize: 16, fontWeight: 700 }}
                                            >
                                                Tìm kiếm
                                            </Button>
                                            <Tooltip title="Xóa bộ lọc">
                                                <IconButton 
                                                    onClick={resetQuery}
                                                    sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: 'white', '&:hover': { bgcolor: '#F1F5F9' } }}
                                                >
                                                    <RefreshIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Stack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B' }}>
                        Dành cho bạn
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
                        {NFTs.length} Bất động sản khả dụng
                    </Typography>
                </Box>

                {NFTs.length > 0 ? (
                    <Grid container spacing={3}>
                        {NFTs.map((nft) => (
                            <Grid item xs={12} sm={6} md={4} key={nft.listingId}>
                                <Box sx={{ 
                                    height: '100%',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}>
                                    <Properties post={nft} onCancel={handleCancelListing} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ textAlign: 'center', py: 15, borderRadius: 8, bgcolor: 'rgba(255,255,255,0.5)', border: '2px dashed #E2E8F0' }} elevation={0}>
                        <LocationOnIcon sx={{ fontSize: 60, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#64748B' }}>
                            Không tìm thấy kết quả nào
                        </Typography>
                        <Typography sx={{ color: '#94A3B8', mb: 3 }}>Thử thay đổi bộ lọc hoặc vị trí tìm kiếm của bạn.</Typography>
                        <Button variant="outlined" onClick={resetQuery} sx={{ borderRadius: 2 }}>Xem tất cả</Button>
                    </Paper>
                )}
            </Container>

            <Box sx={{ mt: 'auto' }}>
                <Footer />
            </Box>
        </Box>
    );
};

export default Main;