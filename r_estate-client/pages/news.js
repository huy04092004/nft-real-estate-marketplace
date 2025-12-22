import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Thêm router để chuyển trang
import { 
    Container, Typography, Grid, Card, CardContent, CardMedia, 
    Box, Chip, Stack, Divider, Skeleton, Button, Paper
} from "@mui/material";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AuthNavbar from "../components/AuthNavbar";
import Footer from '../components/Footer';
import axios from 'axios';
import { newsData } from '../util/newsData'; // Import dữ liệu từ utils

const NewsPage = () => {
    const router = useRouter(); // Khởi tạo router
    const [ethPrice, setEthPrice] = useState(null);
    const [loadingPrice, setLoadingPrice] = useState(true);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true");
                setEthPrice(res.data.ethereum);
            } catch (error) { console.error(error); } finally { setLoadingPrice(false); }
        };
        fetchPrice();
    }, []);

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
            <AuthNavbar />

            {/* WIDGET TỶ GIÁ */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', py: 1.5 }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#94A3B8' }}>Thị trường trực tiếp</Typography>
                        {loadingPrice ? <Skeleton width={100} /> : (
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                ETH: ${ethPrice?.usd?.toLocaleString()} 
                            </Typography>
                        )}
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748B' }}></Typography>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* BÀI VIẾT TIÊU ĐIỂM (Featured) */}
                <Paper elevation={0} sx={{ 
                    borderRadius: 8, overflow: 'hidden', mb: 8, bgcolor: 'white', border: '1px solid #E2E8F0',
                    display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                    cursor: 'pointer', // Hiện bàn tay khi rê chuột vào
                    transition: '0.3s',
                    '&:hover': { boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }
                }} onClick={() => router.push(`/news/${newsData[0].id}`)}>
                    <Box sx={{ width: { xs: '100%', md: '55%' }, height: 400 }}>
                        <CardMedia component="img" image={newsData[0].image} sx={{ height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ p: 6, width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Chip label="NỔI BẬT" color="primary" size="small" sx={{ mb: 2, fontWeight: 700, width: 'fit-content' }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 2 }}>{newsData[0].title}</Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>{newsData[0].summary}</Typography>
                        <Button variant="contained" sx={{ bgcolor: '#1E293B', borderRadius: 2 }}>Đọc ngay</Button>
                    </Box>
                </Paper>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <NewspaperIcon /> Tin mới cập nhật
                </Typography>
                
                <Grid container spacing={4}>
                    {newsData.slice(1).map((news) => ( // Bỏ qua bài đầu tiên vì đã làm Featured ở trên
                        <Grid item xs={12} sm={6} md={4} key={news.id}>
                            <Card 
                                elevation={0} 
                                onClick={() => router.push(`/news/${news.id}`)} // CLICK VÀO ĐỂ SANG TRANG [ID]
                                sx={{ 
                                    borderRadius: 6, border: '1px solid #E2E8F0', height: '100%', cursor: 'pointer',
                                    transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', bgcolor: 'white', boxShadow: '0 15px 30px rgba(0,0,0,0.03)' }
                                }}
                            >
                                <CardMedia component="img" height="200" image={news.image} />
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Chip label={news.category} size="small" sx={{ fontWeight: 600, bgcolor: '#F1F5F9' }} />
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>{news.date}</Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>{news.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>{news.summary}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default NewsPage;