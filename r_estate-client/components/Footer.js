import * as React from 'react';
// Import các thành phần giao diện
import { Divider, IconButton, Container, Box, Typography, Stack, Grid } from '@mui/material'; 

// Import các biểu tượng chuẩn (Dùng TwitterIcon thay vì XIcon để tránh lỗi module)
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: '#F8FAFC', 
                pt: 10, 
                pb: 6, 
                borderTop: '1px solid #E2E8F0',
                position: 'relative'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {/* Cột giới thiệu */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Typography
                                sx={{ 
                                    fontWeight: 900, 
                                    fontSize: 26, 
                                    color: '#1E293B',
                                    letterSpacing: '-1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Box component="span" sx={{ bgcolor: '#4F46E5', width: 12, height: 12, borderRadius: '50%' }} />
                                Real Estate Web3
                            </Typography>
                            
                            <Typography
                                sx={{ 
                                    color: "#64748B", 
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                    maxWidth: 400,
                                    textAlign: { xs: 'center', md: 'left' }
                                }}
                            >
                                Nền tảng tiên phong trong việc số hóa bất động sản thành NFT, mang lại sự minh bạch và an toàn tuyệt đối cho mọi giao dịch trên Blockchain.
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Cột thông tin liên hệ */}
                    <Grid item xs={12} md={6}>
                        <Stack 
                            spacing={2} 
                            sx={{ 
                                alignItems: { xs: 'center', md: 'flex-end' },
                                textAlign: { xs: 'center', md: 'right' }
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', fontSize: 12, letterSpacing: '1px' }}>
                                Liên hệ hỗ trợ
                            </Typography>
                            <Typography
                                sx={{ 
                                    color: "#4F46E5", 
                                    fontSize: 18, 
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': { color: '#3730A3', cursor: 'pointer' }
                                }}
                            >
                                huythptqhh020704@gmail.com
                            </Typography>
                           <Stack direction="row" spacing={1}>
    {/* Twitter / X */}
    <IconButton 
        component="a" 
        href="https://twitter.com/your_profile" 
        target="_blank" 
        sx={{ bgcolor: 'white', color: '#64748B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', '&:hover': { color: '#1DA1F2', transform: 'translateY(-3px)' }, transition: '0.3s' }}
    >
        <TwitterIcon fontSize="small" />
    </IconButton>

    {/* Facebook */}
    <IconButton 
        component="a" 
        href="https://www.facebook.com/pham.huy.577155/" // Thay link FB của bạn vào đây
        target="_blank" 
        rel="noopener noreferrer"
        sx={{ bgcolor: 'white', color: '#64748B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', '&:hover': { color: '#4267B2', transform: 'translateY(-3px)' }, transition: '0.3s' }}
    >
        <FacebookIcon fontSize="small" />
    </IconButton>

    {/* Instagram */}
    <IconButton 
        component="a" 
        href="https://instagram.com/your_profile" 
        target="_blank" 
        sx={{ bgcolor: 'white', color: '#64748B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', '&:hover': { color: '#E1306C', transform: 'translateY(-3px)' }, transition: '0.3s' }}
    >
        <InstagramIcon fontSize="small" />
    </IconButton>

    {/* LinkedIn */}
    <IconButton 
        component="a" 
        href="https://linkedin.com/in/your_profile" 
        target="_blank" 
        sx={{ bgcolor: 'white', color: '#64748B', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', '&:hover': { color: '#0077B5', transform: 'translateY(-3px)' }, transition: '0.3s' }}
    >
        <LinkedInIcon fontSize="small" />
    </IconButton>
</Stack>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: '#E2E8F0', mb: 4 }}/>

                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems="center" 
                    spacing={2}
                >
                    <Typography sx={{ color: '#94A3B8', fontSize: 13, fontWeight: 500 }}>
                        © 2025 Real Estate Web3. Built on Blockchain Technology.
                    </Typography>
                    <Stack direction="row" spacing={3}>
                        {['Điều khoản', 'Bảo mật', 'Quy định'].map((item) => (
                            <Typography 
                                key={item}
                                sx={{ 
                                    color: '#94A3B8', 
                                    fontSize: 13, 
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    '&:hover': { color: '#1E293B' }
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
} 

export default Footer;