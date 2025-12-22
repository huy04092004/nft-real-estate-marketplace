import { Box, Button, Card, Container, Grid, Typography, Paper, Stack, Divider, Avatar } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToasts } from 'react-toast-notifications';
import { useState } from "react";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import deedsData from '../util/deeds.json'; 
import FormInput from "../components/FormInput";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";

export const Schema = Yup.object().shape({
    deedNumber: Yup.string().required("Số định danh không được để trống"),
    deedKey: Yup.string().required("Mã xác thực không được để trống"),
});

const SellProperty = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { addToast } = useToasts();
    const [isVerifying, setIsVerifying] = useState(false);

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated: () => {
            setTimeout(() => { router.push('/') }, 3000)
        },
    });

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(Schema)
    });

 const onSubmit = (deedForm) => {
    setIsVerifying(true);
    
    // Sử dụng trim() để loại bỏ khoảng trắng thừa do người dùng nhập
    const inputNumber = deedForm.deedNumber.trim();
    const inputKey = deedForm.deedKey.trim();

    setTimeout(() => {
        // Log ra để kiểm tra xem mảng deedsData có load đủ không
        console.log("Tổng số bản ghi trong database:", deedsData.length);

        const foundDeed = deedsData.find(
            (d) => String(d.deedNumber) === inputNumber && String(d.deedKey) === inputKey
        );

        if (foundDeed) {
            // Lưu dữ liệu vào localStorage
            localStorage.setItem("fairValue", foundDeed.fairValue);
            localStorage.setItem("verifiedDeed", JSON.stringify(foundDeed));
            
            addToast("Xác thực thành công!", { appearance: 'success' });
            router.push('/sell-property-detail');
        } else {
            addToast("Không tìm thấy thông tin sổ đỏ này!", { appearance: 'error' });
        }
        setIsVerifying(false);
    }, 1500);
}

    if (status === "loading") return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            <AuthNavbar />
            
            <Box sx={{ flexGrow: 1, pt: { xs: 12, md: 15 }, pb: 10 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={5} alignItems="center">
                        
                        {/* Cột trái: Nội dung hướng dẫn */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <Box>
                                
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E293B', mt: 1, mb: 2, lineHeight: 1.2 }}>
                                        Bắt đầu niêm yết <br />
                                        <Box component="span" sx={{ color: '#4F46E5' }}>Bất động sản</Box> của bạn
                                    </Typography>
                                    <Typography sx={{ color: '#64748B', fontSize: '1.1rem', maxWidth: 500 }}>
                                        Để đảm bảo tính minh bạch, chúng tôi cần xác thực thông tin quyền sở hữu của bạn thông qua hệ thống sổ đỏ điện tử.
                                    </Typography>
                                </Box>

                                <Stack spacing={2}>
                                    {[
                                        { icon: <SecurityIcon />, title: "Bảo mật tuyệt đối", desc: "Mã hóa dữ liệu theo tiêu chuẩn quân đội." },
                                        { icon: <VerifiedUserIcon />, title: "Xác thực tức thì", desc: "Kết nối trực tiếp với cơ sở dữ liệu chuỗi khối." }
                                    ].map((item, index) => (
                                        <Box key={index} display="flex" gap={2} alignItems="flex-start">
                                            <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4F46E5' }}>{item.icon}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B' }}>{item.title}</Typography>
                                                <Typography variant="body2" sx={{ color: '#64748B' }}>{item.desc}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Cột phải: Form nhập liệu */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ 
                                p: { xs: 3, md: 5 }, 
                                borderRadius: 8, 
                                border: '1px solid #E2E8F0',
                                background: 'white',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 4 }}>
                                    Nhập mã định danh
                                </Typography>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
                                                Số sổ đỏ (Deed Number)
                                            </Typography>
                                            <Controller
                                                name='deedNumber'
                                                control={control}
                                                render={(props) => (
                                                    <FormInput {...props} placeholder="Ví dụ: VN-BDS-102938" fullWidth />
                                                )}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
                                                Mã bí mật (Secret Key)
                                            </Typography>
                                            <Controller
                                                name='deedKey'
                                                control={control}
                                                render={(props) => (
                                                    <FormInput {...props} type="password" placeholder="Nhập mã bí mật từ sổ đỏ" fullWidth />
                                                )}
                                            />
                                        </Box>

                                        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, display: 'flex', gap: 1.5 }}>
                                            <InfoOutlinedIcon sx={{ color: '#64748B', fontSize: 20 }} />
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Mã bí mật nằm ở mặt sau của sổ đỏ điện tử hoặc được cấp bởi cơ quan chức năng.
                                            </Typography>
                                        </Box>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isVerifying}
                                            sx={{ 
                                                py: 1.8, 
                                                borderRadius: 3, 
                                                fontWeight: 700, 
                                                fontSize: 16,
                                                bgcolor: '#1E293B',
                                                textTransform: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.3)',
                                                '&:hover': { bgcolor: '#000' }
                                            }}
                                        >
                                            {isVerifying ? "Đang xác thực hệ thống..." : "Xác thực tài sản ngay"}
                                        </Button>
                                    </Stack>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}

export default SellProperty;