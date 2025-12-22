import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import { 
    Button, Container, Typography, CardMedia, Card, Grid, Box, 
    TextField, Paper, CircularProgress, Divider, Avatar, IconButton, Fab, Zoom, Stack 
} from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy'; 
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PoolIcon from '@mui/icons-material/Pool';
import AuthNavbar from "../../components/AuthNavbar";
import Carousel from 'react-material-ui-carousel'
import Footer from '../../components/Footer';
import NoAuthNavbar from '../../components/NoAuthNavbar';
import { useSession } from 'next-auth/react'
import { ethers } from 'ethers';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useProperty } from '../../context/PropertyContext';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications'
import { useTranslation } from 'react-i18next';

const PropertyDetails = () => {
    const [nft, setNft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const scrollRef = useRef(null);

    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();
    const { addToast } = useToasts();
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query;
    const { status } = useSession();

    useEffect(() => {
        if (!marketplace || !id || !propertyContract) return;
        loadNFT();
    }, [id, marketplace, propertyContract]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isAiTyping]);

    const loadNFT = async () => {
        try {
            const data = await marketplace.getSpecificListing(id);
            const tokenURI = await propertyContract.tokenURI(data.tokenId);
            const gatewayUrl = tokenURI.replace("https://ipfs.io/ipfs/", "https://gateway.lighthouse.storage/ipfs/");
            const res = await axios.get(gatewayUrl);
            const mData = res.data;
            const getAttr = (trait) => mData.attributes?.find(a => a.trait_type === trait)?.value;

            setNft({
                title: mData.name || mData.title,
                overview: mData.description || mData.overview,
                detail: mData.detail,
                location: getAttr("Location"),
                propertyType: getAttr("Property Type"),
                areaSize: getAttr("Area Size") || getAttr("Living area(sqm)"),
                bedroomNum: getAttr("Bedrooms") || getAttr("Bedroom"),
                bathroomNum: getAttr("Bathrooms") || getAttr("Bathroom"),
                pool: getAttr("Pool"),
                images: mData.allImages || [mData.image],
                price: data.price, 
                listingId: data.listingId.toNumber(),
                seller: data.seller
            });
        } catch (error) {
            console.error("Lỗi tải NFT:", error);
        }
    }

    // HÀM MUA HÀNG ĐÃ ĐƯỢC KHÔI PHỤC VÀ SỬA LỖI
    const handleBuy = async () => {
        if (!nft) return;
        setLoading(true);
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0xaa36a7') {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            }

            // Tính 103% giá trị (Giá + 3% phí hoa hồng giống logic trang Sell)
            const mCommission = nft.price.mul(1).div(100);
            const gCommission = nft.price.mul(2).div(100);
            const totalValue = nft.price.add(mCommission).add(gCommission);

            addToast("Đang chuẩn bị giao dịch...", { appearance: 'info', autoDismiss: true });

            const tx = await marketplace.buy(nft.listingId, { 
                value: totalValue,
                gasLimit: 600000 // Ép gas limit để tránh lỗi estimate gas
            });

            addToast("Giao dịch đang chờ xác nhận...", { appearance: 'info', autoDismiss: true });
            await tx.wait();

            addToast("Giao dịch thành công!", { appearance: 'success', autoDismiss: true });
            router.push("/main");
        } catch (error) {
            console.error("Lỗi mua:", error);
            addToast("Giao dịch thất bại! Hãy kiểm tra lại số dư hoặc ví.", { appearance: 'error' });
        } finally {
            setLoading(false);
        }
    };

   const handleSendMessage = async () => {
    if (!chatInput.trim() || !nft) return;
    const currentMsg = chatInput;
    setChatHistory(prev => [...prev, { role: "user", text: currentMsg }]);
    setChatInput("");
    setIsAiTyping(true);

    // Tính toán các thông số giá để gửi cho AI
    const priceEth = ethers.utils.formatEther(nft.price);
    const feeEth = ethers.utils.formatEther(nft.price.mul(3).div(100));
    const totalEth = ethers.utils.formatEther(nft.price.mul(103).div(100));

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Bạn là chuyên gia tư vấn bất động sản Web3 cho căn nhà: ${nft.title}.
                        THÔNG TIN CHI TIẾT:
                        - Vị trí: ${nft.location}
                        - Diện tích: ${nft.areaSize} m2
                        - Cấu trúc: ${nft.bedroomNum} phòng ngủ, ${nft.bathroomNum} phòng tắm.
                        - Tiện ích: ${nft.pool === 'yes' ? 'Có hồ bơi riêng' : 'Không có hồ bơi'}.
                        
                        THÔNG TIN GIÁ (RẤT QUAN TRỌNG):
                        - Giá gốc niêm yết: ${priceEth} ETH.
                        - Phí giao dịch mạng lưới (3%): ${feeEth} ETH.
                        - Tổng số tiền người mua cần trả: ${totalEth} ETH.
                        
                        HƯỚNG DẪN TRẢ LỜI:
                        1. Luôn dùng đơn vị ETH khi nói về giá.
                        2. Nếu khách hỏi về giá, hãy giải thích rõ: Giá gốc là bao nhiêu, phí dịch vụ 3% là bao nhiêu và tổng cộng là bao nhiêu.
                        3. Nhấn mạnh rằng giao dịch được thực hiện an toàn qua Smart Contract trên blockchain Sepolia.
                        4. Trả lời bằng tiếng Việt, lịch sự, chuyên nghiệp và đầy đủ thông tin.`
                    },
                    ...chatHistory.slice(-3).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
                    { role: "user", content: currentMsg }
                ]
            },
                { headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` } }
        );
        setChatHistory(prev => [...prev, { role: "ai", text: response.data.choices[0].message.content }]);
    } catch (error) {
        addToast("AI bận rồi!", { appearance: 'error' });
    } finally { setIsAiTyping(false); }
};
    const InfoBox = ({ icon, label, value }) => (
        <Grid item xs={6} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 3, bgcolor: '#fdfdfd' }}>
                <Box sx={{ color: '#1976d2', mb: 1 }}>{icon}</Box>
                <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                <Typography variant="body1" fontWeight="bold">{value || 'N/A'}</Typography>
            </Paper>
        </Grid>
    );

    if (!nft) return <Box sx={{ textAlign: 'center', mt: 20 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
            {status === 'unauthenticated' ? <NoAuthNavbar page="main" /> : <AuthNavbar />}
            
            <Box sx={{ bgcolor: 'white', py: 4, borderBottom: '1px solid #e2e8f0' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>{nft.title}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOnIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                <Typography variant="body1" color="text.secondary">{nft.location}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                            <Typography variant="h3" sx={{ color: '#e11d48', fontWeight: 900, mb: 1 }}>
                                {ethers.utils.formatEther(nft.price)} ETH
                            </Typography>
                            <Button 
                                onClick={handleBuy} 
                                disabled={loading}
                                variant="contained" 
                                sx={{ borderRadius: 2, px: 5, py: 1.2, bgcolor: '#1e293b' }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Mua ngay"}
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                            <Carousel navButtonsAlwaysVisible animation="slide">
                                {nft.images.map((img, i) => (
                                    <CardMedia key={i} component="img" sx={{ height: { xs: 300, md: 500 }, objectFit: 'cover' }} image={img} />
                                ))}
                            </Carousel>
                        </Paper>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Thông tin tổng quan</Typography>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <InfoBox icon={<HomeWorkIcon />} label="Loại hình" value={nft.propertyType} />
                            <InfoBox icon={<SquareFootIcon />} label="Diện tích" value={`${nft.areaSize} m²`} />
                            <InfoBox icon={<BedIcon />} label="Phòng ngủ" value={nft.bedroomNum} />
                            <InfoBox icon={<BathtubIcon />} label="Phòng tắm" value={nft.bathroomNum} />
                            <InfoBox icon={<PoolIcon />} label="Hồ bơi" value={nft.pool === 'yes' ? 'Có' : 'Không'} />
                            <InfoBox icon={<LocationOnIcon />} label="Khu vực" value={nft.location} />
                        </Grid>

                        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'white', mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Mô tả chi tiết</Typography>
                            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{nft.detail || nft.overview}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', position: 'sticky', top: 100 }}>
                            <Typography variant="h6" fontWeight="bold" mb={2}>Liên hệ giao dịch</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">Mã niêm yết: #{nft.listingId}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>Người bán: {nft.seller.slice(0,6)}...{nft.seller.slice(-4)}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
                <Zoom in={chatOpen}>
                    <Paper elevation={20} sx={{ position: 'absolute', bottom: 80, right: 0, width: 350, height: 500, borderRadius: 5, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: '#1e293b', color: 'white' }}>AI Advisor</Box>
                        <Box ref={scrollRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f1f5f9' }}>
                            {chatHistory.map((msg, i) => (
                                <Box key={i} sx={{ mb: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, display: 'inline-block', bgcolor: msg.role === 'user' ? '#3b82f6' : 'white', color: msg.role === 'user' ? 'white' : 'black' }}>
                                        {msg.text}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1 }}>
                            <TextField fullWidth size="small" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                            <Fab size="small" color="primary" onClick={handleSendMessage}><SendIcon /></Fab>
                        </Box>
                    </Paper>
                </Zoom>
                <Fab color="primary" onClick={() => setChatOpen(!chatOpen)} sx={{ bgcolor: '#1e293b' }}>
                    {chatOpen ? <CloseIcon /> : <SmartToyIcon />}
                </Fab>
            </Box>
            <Footer />
        </Box>
    );
}

export default PropertyDetails;