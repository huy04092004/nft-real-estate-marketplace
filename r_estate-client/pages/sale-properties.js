// import { Grid, Card, Container, Typography, Button, Box, CircularProgress } from "@mui/material";
// import AuthNavbar from "../components/AuthNavbar";
// import UserProperty from "../components/UserProperty";
// import Footer from "../components/Footer";
// import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/react';
// import { useAccount } from 'wagmi';
// import { useMarketplace } from "../context/MarketplaceContext";
// import { useProperty } from "../context/PropertyContext";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// const SaleProperties = () => {
//     const [NFTs, setNFTs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isAccountExist, setIsAccountExist] = useState(true);

//     const router = useRouter();
//     const { t } = useTranslation();
//     const { marketplace } = useMarketplace();
//     const { propertyContract } = useProperty();
//     const { address: accountAddress } = useAccount();

//     const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

//     const { data: session } = useSession({
//         required: true,
//         onUnauthenticated: () => {
//             setTimeout(() => {
//                 router.push('/')
//             }, 3000)
//         },
//     });

//     useEffect(() => {
//         // Nếu đã có marketplace và ví, bắt đầu load
//         if (marketplace && accountAddress) {
//             setIsAccountExist(true);
//             loadSellerNFTs();
//         } else if (!marketplace && !loading) {
//             setIsAccountExist(false);
//         }
//     }, [marketplace, accountAddress]);

//     const loadSellerNFTs = async () => {
//         try {
//             setLoading(true);
//             const data = await marketplace.getListingsCreated();
            
//             // LỌC: Chỉ lấy những căn ĐANG rao bán (chưa có người mua)
//             const activeListings = data.filter(item => item.owner === ADDRESS_ZERO);

//             const items = await Promise.all(
//                 activeListings.map(async (nft) => {
//                     const tokenURI = await propertyContract.tokenURI(nft.tokenId);
//                     // Dùng Lighthouse Gateway để tốc độ tải nhanh hơn
//                     const gatewayUrl = tokenURI.replace("https://ipfs.io/ipfs/", "https://gateway.lighthouse.storage/ipfs/");
                    
//                     const metadata = await axios.get(gatewayUrl);
                    
//                     return {
//                         location: metadata.data.location || metadata.data.address,
//                         images: metadata.data.allImages || [metadata.data.image],
//                         seller: nft.seller,
//                         owner: nft.owner,
//                         tokenId: nft.tokenId.toNumber(),
//                         listingId: nft.listingId.toNumber(),
//                         price: nft.price, // Giữ nguyên định dạng để UserProperty xử lý hoặc formatEther ở đây
//                         title: metadata.data.name || metadata.data.title
//                     };
//                 })
//             );
//             setNFTs(items);
//         } catch (error) {
//             console.error("Error loading seller NFTs:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (!isAccountExist) {
//         return (
//             <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '80vh' }}>
//                 <Typography variant="h5" color="textSecondary">{t("sale_properties_connect_wallet_message")}</Typography>
//                 <Button
//                     onClick={() => router.push('/profile')}
//                     variant="contained"
//                     sx={{ mt: 3, bgcolor: '#37474f', '&:hover': { bgcolor: '#546e7a' } }}
//                 >
//                     {t("sale_properties_connect_wallet_button")}
//                 </Button>
//             </Grid>
//         )
//     }

//     return (
//         <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//             <AuthNavbar />
            
//             {session ? (
//                 <Box>
//                     {/* Header Section */}
//                     <Card sx={{ marginTop: 10, bgcolor: '#455a64', color: 'white', borderRadius: 0, py: 4 }}>
//                         <Container maxWidth="lg">
//                             <Typography variant="h4" sx={{ fontFamily: 'Raleway', fontWeight: 'bold' }}>
//                                 {t("sale_properties_page_title")}
//                             </Typography>
//                             <Typography variant="subtitle1">
//                                 Danh sách các bất động sản bạn đang niêm yết trên thị trường
//                             </Typography>
//                         </Container>
//                     </Card>

//                     <Container maxWidth="lg" sx={{ py: 6 }}>
//                         {loading ? (
//                             <Box textAlign="center" py={10}>
//                                 <CircularProgress color="inherit" />
//                                 <Typography sx={{ mt: 2 }}>{t("fetch_data_message")}</Typography>
//                             </Box>
//                         ) : NFTs.length === 0 ? (
//                             <Box textAlign="center" py={10} bgcolor="white" borderRadius={2}>
//                                 <Typography variant="h6" color="textSecondary">Bạn không có bất động sản nào đang rao bán.</Typography>
//                                 <Button variant="outlined" sx={{ mt: 2 }} onClick={() => router.push('/sell-property')}>
//                                     Đăng bán ngay
//                                 </Button>
//                             </Box>
//                         ) : (
//                             <Grid container spacing={3}>
//                                 {NFTs.map((nft, index) => (
//                                     <Grid item xs={12} key={index}>
//                                         {/* Component UserProperty hiển thị từng dòng NFT */}
//                                         <UserProperty property={nft} />
//                                     </Grid>
//                                 ))}
//                             </Grid>
//                         )}
//                     </Container>
//                 </Box>
//             ) : (
//                 <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
//                     <Typography variant="h5">{t("loading_message")}</Typography>
//                 </Grid>
//             )}
//             <Footer />
//         </Box>
//     )
// }

// export default SaleProperties;