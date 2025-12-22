import * as React from 'react';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Box, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import ShowerIcon from '@mui/icons-material/Shower';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Thêm icon xóa
import { ethers } from "ethers";
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // Để kiểm tra chủ sở hữu

const Properties = (props) => {
    const { post, onCancel } = props; // Nhận thêm hàm onCancel từ cha nếu có
    const { data: session } = useSession();

    if (!post) return null;

    // Kiểm tra xem người đang đăng nhập có phải là người bán không
    // Lưu ý: So sánh địa chỉ ví thường nên viết thường (toLowerCase)
    const isOwner = session?.address?.toLowerCase() === post.seller?.toLowerCase();

    // Logic lấy ảnh từ Lighthouse
    const displayImage = post.image || (post.images && post.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <Box sx={{ flexGrow: 1, marginTop: 4, marginLeft: 2, maxWidth: 300, minWidth: 280 }}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative' }}>
                
                {/* Nút Xóa (Chỉ hiện nếu là chủ sở hữu) */}
                {isOwner && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(e) => {
                            e.preventDefault(); // Ngăn việc nhảy vào Link khi bấm nút
                            if(window.confirm("Bạn có chắc chắn muốn gỡ bất động sản này khỏi chợ không?")) {
                                onCancel && onCancel(post.listingId);
                            }
                        }}
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            zIndex: 2, 
                            minWidth: 'auto',
                            padding: '4px 8px',
                            borderRadius: '8px'
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </Button>
                )}

                <Link href={`/property/${post.listingId}`} passHref>
                    <CardActionArea component="a">
                        <CardMedia
                            component="img"
                            sx={{ height: 200 }}
                            image={displayImage}
                            alt={post.title}
                        />
                        <CardContent sx={{ padding: 2 }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: 18, textTransform: 'capitalize', mb: 1 }} noWrap>
                                {post.title || "Untitled Property"}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden', mb: 2 }}>
                                {post.overview ? `${post.overview.substring(0, 60)}...` : "No description."}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#616161' }}>
                                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                    {post.location}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <BedroomParentIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">{post.bedroomNum}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ShowerIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">{post.bathroomNum}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: '500' }}>{post.areaSize} m²</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #eee' }}>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e' }}>
                                    {typeof post.price === 'string' ? post.price : ethers.utils.formatEther(post.price)} ETH
                                </Typography>
                                <Box sx={{ backgroundColor: '#e8eaf6', padding: '2px 8px', borderRadius: '4px' }}>
                                    <Typography sx={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 'bold', color: '#3f51b5' }}>
                                        {post.propertyType}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </Card>
        </Box>
    );
}

export default Properties;