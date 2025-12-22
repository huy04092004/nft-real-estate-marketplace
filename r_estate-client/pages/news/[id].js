import React from 'react';
import { useRouter } from 'next/router';
import { 
    Container, Typography, Box, Chip, CardMedia, 
    Divider, Button, Stack, Avatar,Paper
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AuthNavbar from "../../components/AuthNavbar";
import Footer from '../../components/Footer';
import { newsData } from '../../util/newsData'; // Import từ utils như bạn muốn

const NewsDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    // Tìm bài viết khớp với ID trên trình duyệt
    const post = newsData.find(item => item.id === id);

    // Hiển thị trạng thái chờ khi Next.js chưa lấy được id hoặc không tìm thấy bài
    if (!post) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="textSecondary">Đang tải bài viết...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            <AuthNavbar />
            
            <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
                {/* Nút quay lại */}
                <Button 
                    startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />} 
                    onClick={() => router.push('/news')} 
                    sx={{ mb: 4, color: '#64748B', textTransform: 'none', fontWeight: 600 }}
                >
                    Quay lại bản tin
                </Button>

                {/* Nhãn chuyên mục */}
                <Chip 
                    label={post.category} 
                    sx={{ 
                        mb: 3, 
                        bgcolor: '#F1F5F9', 
                        color: '#1E293B', 
                        fontWeight: 700,
                        borderRadius: 1.5
                    }} 
                />
                
                {/* Tiêu đề chính */}
                <Typography 
                    variant="h2" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#1E293B', 
                        mb: 3, 
                        lineHeight: 1.2,
                        fontSize: { xs: '2rem', md: '3rem' },
                        letterSpacing: '-1px'
                    }}
                >
                    {post.title}
                </Typography>

                {/* Thông tin tác giả & Ngày đăng */}
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1E293B', fontSize: '0.8rem' }}>AI</Avatar>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 600 }}>
                            Ban Biên Tập Real Estate
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#94A3B8' }}>
                        <CalendarMonthIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{post.date}</Typography>
                    </Stack>
                </Stack>

                {/* Hình ảnh đại diện bài viết */}
                <CardMedia 
                    component="img" 
                    image={post.image} 
                    sx={{ 
                        borderRadius: 8, 
                        mb: 6, 
                        height: { xs: 300, md: 500 }, 
                        objectFit: 'cover',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                    }} 
                />

                {/* NỘI DUNG BÀI VIẾT */}
                <Box 
                    sx={{ 
                        color: '#334155', 
                        lineHeight: 1.8, 
                        fontSize: '1.2rem',
                        '& p': { mb: 4 }, // Khoảng cách giữa các đoạn văn
                        '& b': { color: '#1E293B', fontWeight: 700 }, // In đậm
                        '& ul': { mb: 4, pl: 3 }, // Danh sách
                        '& li': { mb: 1 }
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                <Divider sx={{ my: 8, borderStyle: 'dashed' }} />
                
                {/* Box kêu gọi hành động (CTA) */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 5, 
                        bgcolor: '#F8FAFC', 
                        borderRadius: 6, 
                        textAlign: 'center',
                        border: '1px solid #E2E8F0'
                    }}
                >
                    <Typography variant="h5" fontWeight={800} sx={{ color: '#1E293B', mb: 2 }}>
                        Bạn thấy thông tin này hữu ích?
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                        Khám phá ngay danh sách các căn hộ đang được niêm yết với giá tốt nhất trên hệ thống của chúng tôi.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => router.push('/main')} 
                        sx={{ 
                            px: 6, 
                            py: 1.5, 
                            bgcolor: '#1E293B', 
                            borderRadius: 3, 
                            textTransform: 'none',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#334155' }
                        }}
                    >
                        Xem danh sách nhà ngay
                    </Button>
                </Paper>
            </Container>
            
            <Footer />
        </Box>
    );
};

export default NewsDetail;