import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Chip, Tabs, Tab, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Thêm icon xóa
import AuthNavbar from "../components/AuthNavbar";
import Footer from '../components/Footer';
import { ethers } from 'ethers';
import { useMarketplace } from '../context/MarketplaceContext';
import { useProperty } from '../context/PropertyContext';
import axios from 'axios';
import { useRouter } from 'next/router';

const MyAssets = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0); 
    
    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();
    const router = useRouter();

    const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

    useEffect(() => {
        if (marketplace && propertyContract) {
            loadData();
        }
    }, [marketplace, propertyContract, tabValue]);

    // Hàm Xử lý Xóa (Ẩn) khỏi giao diện
    const handleHideItem = (listingId) => {
        if (window.confirm("Bạn có chắc chắn muốn ẩn căn hộ này khỏi danh sách không?")) {
            // Lấy danh sách đã ẩn cũ từ localStorage
            const hiddenItems = JSON.parse(localStorage.getItem('hidden_listings') || '[]');
            // Thêm ID mới vào
            hiddenItems.push(listingId);
            // Lưu lại
            localStorage.setItem('hidden_listings', JSON.stringify(hiddenItems));
            
            // Cập nhật lại UI ngay lập tức
            setNfts(prev => prev.filter(item => item.listingId !== listingId));
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setNfts([]);
            
            // Đọc danh sách ID bị ẩn từ localStorage
            const hiddenItems = JSON.parse(localStorage.getItem('hidden_listings') || '[]');
            
            let data = [];
            if (tabValue === 0) {
                data = await marketplace.getMyListings();
            } else {
                const rawData = await marketplace.getListingsCreated();
                data = rawData.filter(item => item.owner === ADDRESS_ZERO);
            }

            const items = await Promise.all(data.map(async i => {
                const tokenURI = await propertyContract.tokenURI(i.tokenId);
                const gatewayUrl = tokenURI.replace("https://ipfs.io/ipfs/", "https://gateway.lighthouse.storage/ipfs/");
                const meta = await axios.get(gatewayUrl);

                return {
                    listingId: i.listingId.toNumber(), // Lưu lại listingId để xóa
                    price: ethers.utils.formatEther(i.price),
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    title: meta.data.name || meta.data.title,
                    description: meta.data.description || meta.data.overview,
                };
            }));

            // LỌC: Bỏ qua những item có ID nằm trong danh sách ẩn
            const filteredItems = items.filter(item => !hiddenItems.includes(item.listingId));

            setNfts(filteredItems);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <AuthNavbar />
            
            <Box sx={{ bgcolor: '#263238', py: 6, color: 'white', mt: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold">Quản lý bất động sản của tôi</Typography>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        textColor="inherit" 
                        indicatorColor="primary"
                        sx={{ mt: 3, '& .Mui-selected': { color: '#4fc3f7 !important' } }}
                    >
                        <Tab label="Đã sở hữu (Mua)" sx={{ fontWeight: 'bold' }} />
                        <Tab label="Đang rao bán" sx={{ fontWeight: 'bold' }} />
                    </Tabs>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {loading ? (
                    <Box textAlign="center" py={10}><CircularProgress /></Box>
                ) : nfts.length === 0 ? (
                    <Box textAlign="center" py={10} sx={{ bgcolor: 'white', borderRadius: 2 }}>
                        <Typography color="textSecondary">Không có căn hộ nào hiển thị.</Typography>
                        <Button onClick={() => { localStorage.removeItem('hidden_listings'); loadData(); }} sx={{ mt: 2 }}>
                            Hiện lại tất cả đã ẩn
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {nfts.map((nft, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', position: 'relative', borderRadius: 2 }}>
                                    
                                    {/* Nút Xóa (Ẩn) nằm ở góc trên bên phải của ảnh */}
                                    <Tooltip title="Ẩn khỏi danh sách">
                                        <IconButton 
                                            onClick={() => handleHideItem(nft.listingId)}
                                            sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white', color: 'red' } }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={nft.image}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => router.push(`/property/${nft.tokenId}`)}
                                    />
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Chip label={`ID: #${nft.tokenId}`} size="small" />
                                            <Typography variant="h6" color="error" fontWeight="bold">{nft.price} ETH</Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" noWrap>{nft.title}</Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ height: 40, overflow: 'hidden' }}>{nft.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default MyAssets;