import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios'; // Đảm bảo bạn đã chạy: npm install axios

export default function TestAI() {
    const [input, setInput] = useState("Chào Groq! Bạn có thể trả lời tiếng Việt không?");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const testConnection = async () => {
        setLoading(true);
        setResponse("");
        
        // Bạn có thể dán trực tiếp Key vào đây để test nhanh, 
        // hoặc dùng process.env.NEXT_PUBLIC_GROQ_API_KEY
        const apiKey = "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"; 

        try {
            if (!apiKey || apiKey.includes("DÁN_MÃ")) {
                throw new Error("Chưa cấu hình Groq API Key!");
            }

            const res = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    // Llama 3 là model mạnh nhất và miễn phí trên Groq hiện tại
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "user", content: input }
                    ],
                    temperature: 0.7
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const botText = res.data.choices[0].message.content;
            setResponse(botText);
            setStatus({ type: 'success', msg: 'Kết nối Groq thành công!' });
        } catch (error) {
            console.error("Lỗi Groq:", error);
            const errorMsg = error.response?.data?.error?.message || error.message;
            setResponse(`LỖI: ${errorMsg}`);
            setStatus({ type: 'error', msg: 'Không thể kết nối với Groq.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="secondary">
                    ⚡ Groq AI Cloud Test
                </Typography>
                
                {status.msg && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

                <TextField 
                    fullWidth 
                    multiline 
                    rows={3} 
                    label="Nhập câu hỏi test"
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    sx={{ mb: 2 }} 
                />

                <Button 
                    fullWidth 
                    variant="contained" 
                    color="secondary"
                    onClick={testConnection} 
                    disabled={loading}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "GỬI YÊU CẦU ĐẾN GROQ"}
                </Button>

                {response && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f4f8', borderRadius: 1, borderLeft: '5px solid #7b1fa2' }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {response}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}