import React, { useEffect, useState, useRef } from 'react';
import { 
    Container, Typography, Box, TextField, Paper, CircularProgress, 
    Avatar, IconButton, Stack, Fab, Divider
} from "@mui/material";
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone'; 
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AuthNavbar from "../components/AuthNavbar";
import NoAuthNavbar from "../components/NoAuthNavbar";
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useProperty } from '../context/PropertyContext';
import { ethers } from 'ethers';
import axios from 'axios';

const AIAssistant = () => {
    const [allProperties, setAllProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const scrollRef = useRef(null);
    const { status } = useSession();
    
    const { marketplace } = useMarketplace();
    const { propertyContract } = useProperty();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isAiTyping]);

    useEffect(() => {
        const init = async () => {
            if (marketplace && propertyContract) {
                await loadAllProperties();
            }
        };
        init();
    }, [marketplace, propertyContract]);

    const loadAllProperties = async () => {
        setLoading(true);
        try {
            console.log("Đang gọi hàm getAllListings...");
            // SỬA TẠI ĐÂY: Dùng đúng tên hàm của bạn
            const listings = await marketplace.getAllListings();
            
            const items = await Promise.all(listings.map(async (i) => {
                try {
                    // Lấy TokenURI từ Property Contract
                    const tokenURI = await propertyContract.tokenURI(i.tokenId);
                    const gatewayUrl = tokenURI.replace("https://ipfs.io/ipfs/", "https://gateway.lighthouse.storage/ipfs/");
                    const res = await axios.get(gatewayUrl);
                    const mData = res.data;
                    
                    const getAttr = (trait) => mData.attributes?.find(a => a.trait_type === trait)?.value;
                    
                    return {
                        title: mData.name || mData.title || "Tài sản chưa đặt tên",
                        price: ethers.utils.formatEther(i.price),
                        location: getAttr("Location") || "Chưa rõ vị trí",
                        rooms: getAttr("Bedrooms") || getAttr("Bedroom") || "N/A",
                        id: i.listingId.toNumber()
                    };
                } catch (err) {
                    console.error("Lỗi load item:", err);
                    return null;
                }
            }));

            const filteredItems = items.filter(item => item !== null);
            setAllProperties(filteredItems);
            console.log("Đã tải xong danh sách nhà:", filteredItems);
        } catch (e) {
            console.error("Lỗi khi load tài sản:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async () => {
        if (!chatInput.trim() || isAiTyping) return;
        
        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
        setChatInput("");
        setIsAiTyping(true);

        // Chuẩn bị dữ liệu cho AI
        const contextString = allProperties.length > 0 
            ? allProperties.map(p => `- Căn ${p.title}: Giá ${p.price} ETH, Vị trí ${p.location}, ${p.rooms} PN.`).join("\n")
            : "Hiện tại sàn chưa có căn nhà nào được đăng bán.";

        try {
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `Bạn là trợ lý AI cao cấp của sàn BĐS Web3. 
                            Danh sách nhà hiện có:\n${contextString}\n
                            Nhiệm vụ: Tư vấn căn nhà phù hợp dựa trên yêu cầu của khách. Trả lời bằng tiếng Việt nhã nhặn, chuyên nghiệp.`
                        },
                        ...chatHistory.slice(-4).map(m => ({ 
                            role: m.role === "user" ? "user" : "assistant", 
                            content: m.text 
                        })),
                        { role: "user", content: userMsg }
                    ]
                },
                { headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` } }
            );
            
            setChatHistory(prev => [...prev, { role: "ai", text: response.data.choices[0].message.content }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: "ai", text: "Xin lỗi, tôi gặp chút vấn đề khi kết nối. Hãy thử lại nhé!" }]);
        } finally {
            setIsAiTyping(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {status === 'unauthenticated' ? <NoAuthNavbar /> : <AuthNavbar />}

            <Container maxWidth="md" sx={{ flexGrow: 1, py: 5, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>Trợ Lý Tìm Nhà AI 🤖</Typography>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                        {loading ? "Đang quét Blockchain..." : `Tôi đang quản lý ${allProperties.length} căn nhà đang rao bán.`}
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ 
                    flexGrow: 1, borderRadius: 8, display: 'flex', flexDirection: 'column', 
                    overflow: 'hidden', border: '1px solid #E2E8F0', bgcolor: 'white',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.03)', height: '65vh'
                }}>
                    <Box ref={scrollRef} sx={{ flexGrow: 1, p: 3, overflowY: 'auto', bgcolor: '#F8FAFC' }}>
                        {loading && allProperties.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 10 }}>
                                <CircularProgress size={30} sx={{ color: '#1E293B' }} />
                                <Typography sx={{ mt: 2, color: '#64748B' }}>Đang lấy dữ liệu từ Smart Contract...</Typography>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#1E293B' }}><SmartToyTwoToneIcon /></Avatar>
                                    <Box sx={{ p: 2, borderRadius: '20px 20px 20px 4px', bgcolor: 'white', border: '1px solid #F1F5F9', maxWidth: '85%' }}>
                                        <Typography variant="body2" sx={{ color: '#334155' }}>
                                            Chào bạn! Tôi có thể giúp bạn lọc nhà theo giá, vị trí hoặc số phòng ngủ. Bạn muốn tìm nhà như thế nào?
                                        </Typography>
                                    </Box>
                                </Box>

                                {chatHistory.map((msg, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 3 }}>
                                        <Box sx={{ 
                                            maxWidth: '80%', p: 2, borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
                                            bgcolor: msg.role === 'user' ? '#1E293B' : 'white',
                                            color: msg.role === 'user' ? 'white' : '#334155',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                            border: msg.role === 'user' ? 'none' : '1px solid #F1F5F9'
                                        }}>
                                            <Typography variant="body2">{msg.text}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                                {isAiTyping && <CircularProgress size={16} sx={{ m: 2, color: '#CBD5E1' }} />}
                            </>
                        )}
                    </Box>

                    <Box sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 2 }}>
                        <TextField 
                            fullWidth 
                            placeholder="Ví dụ: Căn nào ở Istanbul rẻ nhất?" 
                            disabled={loading || isAiTyping}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#F8FAFC', '& fieldset': { border: 'none' } } }}
                        />
                        <Fab 
                            size="medium" 
                            onClick={handleChat} 
                            disabled={isAiTyping || loading} 
                            sx={{ bgcolor: '#1E293B', color: 'white', '&:hover': { bgcolor: '#334155' } }}
                        >
                            <SendRoundedIcon />
                        </Fab>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default AIAssistant;