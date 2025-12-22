import React, { useState } from 'react';
import { Box, Button, Card, Container, Grid, Typography, Stack, Paper } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Controller, useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import FormInput from "../components/FormInput";
import AuthNavbar from "../components/AuthNavbar";
import QueryInput from "../components/QueryInput";
import { useProperty } from "../context/PropertyContext";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMarketplace } from '../context/MarketplaceContext';
import { PROPERTY_NFT_ADDRESS } from '../Config';
import { ethers } from "ethers";
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import lighthouse from "@lighthouse-web3/sdk";

// Cấu hình Schema Validation - Đã gộp phần mô tả
export const Schema = Yup.object().shape({
    title: Yup.string().required("Vui lòng nhập tiêu đề"),
    overview: Yup.string().required("Vui lòng nhập mô tả chi tiết tài sản"),
    price: Yup.number().typeError("Phải là một con số").required("Vui lòng nhập giá"),
    location: Yup.string().required("Vui lòng chọn địa điểm"),
    areaSize: Yup.number().typeError("Phải là một con số").required("Vui lòng nhập diện tích"),
    bathroomNum: Yup.number().typeError("Phải là số").required("Bắt buộc"),
    bedroomNum: Yup.number().typeError("Phải là số").required("Bắt buộc"),
    propertyType: Yup.string().required("Bắt buộc"),
    pool: Yup.string().required("Bắt buộc")
});

const typeList = [
    { value: "apartment", label: 'Căn hộ (Apartment)' }, 
    { value: "villa", label: 'Biệt thự (Villa)' }, 
    { value: "bungalow", label: 'Nhà gỗ (Bungalow)' }, 
    { value: "penthouse", label: 'Penthouse' }
];

const cityList = [
    { value: 'hanoi', label: 'Hà Nội' }, 
    { value: 'hcm', label: 'TP. Hồ Chí Minh' }, 
    { value: 'danang', label: 'Đà Nẵng' }, 
    { value: 'nhatrang', label: 'Nha Trang' }, 
    { value: 'dalat', label: 'Đà Lạt' }
];

const poolCheck = [{ value: "yes", label: "Có" }, { value: "no", label: "Không" }];

const SellPropertyDetail = () => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const { addToast } = useToasts();
    const router = useRouter();
    const { t } = useTranslation();
    const { propertyContract } = useProperty();
    const { marketplace } = useMarketplace();

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: acceptedFiles => {
            setImages(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const { data: session } = useSession({ 
        required: true, 
        onUnauthenticated: () => router.push('/auth/sign-in') 
    });
    
    const { handleSubmit, control } = useForm({ 
        resolver: yupResolver(Schema),
        defaultValues: { location: '', propertyType: '', pool: '', overview: '' }
    });

    const uploadToLighthouse = async (files, formData) => {
        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY;
        if (!apiKey) throw new Error("Lighthouse API key missing");
        const uploadResponse = await lighthouse.upload(files, apiKey);
        const folderHash = uploadResponse.data.Hash;
        const mainImageUrl = `https://gateway.lighthouse.storage/ipfs/${folderHash}/${files[0].name}`;

        const metadata = {
            name: formData.title,
            description: formData.overview, // Nội dung chi tiết sẽ nằm ở đây
            image: mainImageUrl,
            allImages: files.map(f => `https://gateway.lighthouse.storage/ipfs/${folderHash}/${f.name}`),
            attributes: [
                { trait_type: "Location", value: formData.location },
                { trait_type: "Property Type", value: formData.propertyType },
                { trait_type: "Area Size", value: formData.areaSize },
                { trait_type: "Bedrooms", value: formData.bedroomNum },
                { trait_type: "Bathrooms", value: formData.bathroomNum },
                { trait_type: "Pool", value: formData.pool }
            ]
        };

        const jsonResponse = await lighthouse.uploadText(JSON.stringify(metadata), apiKey, `prop-${Date.now()}.json`);
        return `https://gateway.lighthouse.storage/ipfs/${jsonResponse.data.Hash}`;
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            addToast("Vui lòng tải lên ít nhất 1 ảnh", { appearance: 'error' });
            return;
        }
        try {
            setLoading(true);
            const tokenURI = await uploadToLighthouse(images, data);
            const mintTx = await propertyContract.mint(tokenURI);
            const receipt = await mintTx.wait();
            const event = receipt.events.find(e => e.event === 'Transfer');
            const tokenId = event.args.tokenId;
            const priceInWei = ethers.utils.parseEther(data.price.toString());
            const listTx = await marketplace.createListing(PROPERTY_NFT_ADDRESS, tokenId, priceInWei);
            await listTx.wait();

            addToast("Niêm yết bất động sản thành công!", { appearance: 'success' });
            router.push("/main");
        } catch (err) {
            addToast("Lỗi: " + err.message, { appearance: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
            <AuthNavbar />
            
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', pt: 12, pb: 6 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                        {t("sell_property_detail_page_title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Cung cấp thông tin chính xác để tạo tài sản số (NFT) trên mạng lưới Blockchain.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -4, mb: 10 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        
                        {/* 1. Upload Hình ảnh */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Hình ảnh tài sản</Typography>
                            <Box 
                                {...getRootProps()} 
                                sx={{ 
                                    p: 5, border: '2px dashed #CBD5E1', bgcolor: '#F1F5F9', 
                                    textAlign: 'center', cursor: 'pointer', borderRadius: 3,
                                    transition: '0.3s', '&:hover': { bgcolor: '#E2E8F0', borderColor: '#94A3B8' }
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
                                <Typography sx={{ fontWeight: 600 }}>Kéo thả hoặc chọn nhiều ảnh cùng lúc</Typography>
                                <Typography variant="caption" color="textSecondary">Ảnh đầu tiên sẽ được dùng làm ảnh bìa NFT.</Typography>
                                
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3, justifyContent: 'center' }}>
                                    {images.map((file, idx) => (
                                        <Box key={idx} sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', border: '2px solid white', boxShadow: 1 }}>
                                            <img src={file.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Paper>

                        {/* 2. Thông tin mô tả - ĐÃ GỘP */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Nội dung niêm yết</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Controller name='title' control={control} render={(p) => <FormInput {...p} label="Tiêu đề tài sản" placeholder="Ví dụ: Căn hộ dát vàng tầng cao ven sông" />} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller name='overview' control={control} render={(p) => <FormInput {...p} label="Mô tả chi tiết tài sản" rows={8} placeholder="Mô tả kỹ về nội thất, tiện ích, pháp lý và các đặc điểm nổi bật khác..." />} />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* 3. Thông số kỹ thuật & Giá */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Thông số kỹ thuật & Giá</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Controller name='price' control={control} render={(p) => <FormInput {...p} label="Giá niêm yết (ETH)" placeholder="0.05" />} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller name='areaSize' control={control} render={(p) => <FormInput {...p} label="Diện tích (m²)" placeholder="120" />} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller name='location' control={control} render={({ field }) => <QueryInput field={field} queryName="Vị trí" options={cityList} />} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller name='propertyType' control={control} render={({ field }) => <QueryInput field={field} queryName="Loại hình" options={typeList} />} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller name='pool' control={control} render={({ field }) => <QueryInput field={field} queryName="Hồ bơi" options={poolCheck} />} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller name='bedroomNum' control={control} render={(p) => <FormInput {...p} label="Số phòng ngủ" />} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller name='bathroomNum' control={control} render={(p) => <FormInput {...p} label="Số phòng tắm" />} />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Nút gửi */}
                        <LoadingButton 
                            type="submit" 
                            loading={loading} 
                            startIcon={<SaveIcon />} 
                            variant="contained" 
                            fullWidth 
                            sx={{ 
                                py: 2, borderRadius: 3, fontSize: 18, fontWeight: 700,
                                bgcolor: '#1E293B', '&:hover': { bgcolor: '#334155' },
                                boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.3)'
                            }}
                        >
                            {loading ? "Đang xử lý giao dịch Blockchain..." : "Xác nhận & Niêm yết tài sản"}
                        </LoadingButton>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
};

export default SellPropertyDetail;