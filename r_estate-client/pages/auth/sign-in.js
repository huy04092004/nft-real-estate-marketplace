import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { 
    Button, Typography, Container, Card, Box, 
    Stack, CircularProgress, Divider 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SignIn = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

 if (status === 'loading') {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: '#64748B' }}>
                Đang tải dữ liệu...
            </Typography>
        </Box>
    );
}

    if (session) {
        setTimeout(() => router.push('/main'), 1000);
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B', animate: 'pulse 1.5s infinite' }}>
                    Đang xác thực tài khoản...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column'
        }}>
            {/* Nút quay lại góc trái */}
            <Box sx={{ p: 3 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.push('/')}
                    sx={{ color: '#64748B', textTransform: 'none', fontWeight: 600 }}
                >
                    Trang chủ
                </Button>
            </Box>

            <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Card elevation={0} sx={{ 
                    p: { xs: 4, md: 6 }, 
                    borderRadius: 8, 
                    border: '1px solid #E2E8F0',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    width: '200%',
                    maxWidth: 800,
                    textAlign: 'center'
                }}>
                    {/* Biểu tượng đại diện giả lập logo */}
                    <Box sx={{ 
                        width: 60, height: 60, bgcolor: '#1E293B', borderRadius: 3, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        mx: 'auto', mb: 3,
                        boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)'
                    }}>
                        <Typography sx={{ color: 'white', fontWeight: 3500, fontSize: 17 }}>LOGIN</Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 1, letterSpacing: '-0.5px' }}>
                        Bắt đầu ngay
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 5 }}>
                        Tiếp cận thị trường bất động sản phi tập trung chỉ với một cú chạm.
                    </Typography>

                    <Stack spacing={2}>
                        <Button
                            onClick={() => signIn('google')}
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            sx={{ 
                                py: 1.8,
                                borderRadius: 4,
                                color: '#1E293B',
                                borderColor: '#E2E8F0',
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: '#1E293B',
                                    color: 'white',
                                    borderColor: '#1E293B',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 20px rgba(30, 41, 59, 0.1)'
                                }
                            }}
                        >
                            Đăng nhập bằng Google
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 4, mb: 2 }}>
                        <Divider>
                            <Typography variant="caption" sx={{ color: '#94A3B8', px: 1 }}>KẾT NỐI AN TOÀN</Typography>
                        </Divider>
                    </Box>

                    <Typography variant="caption" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                        Dữ liệu của bạn được bảo mật theo tiêu chuẩn mã hóa SSL 256-bit.
                    </Typography>
                </Card>
            </Container>

            {/* Chân trang đơn giản */}
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    © 2025 R-Estate Platform. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default SignIn;