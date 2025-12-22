import { Box, Typography, Grid, Container, CssBaseline, Card, CardContent, CardMedia, Button, Stack, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NoAuthNavbar from '../components/NoAuthNavbar';
import Footer from '../components/Footer';
import { newsData } from '../util/newsData';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  }
});

export default function Home() {
  const router = useRouter();
  const [ethPrice, setEthPrice] = useState(null);

  // Giả sử kiểm tra trạng thái đăng nhập (Bạn có thể thay bằng logic thực tế của dự án)
  const isLoggedIn = false; 

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        setEthPrice(res.data.ethereum.usd);
      } catch (e) { console.log(e); }
    };
    fetchPrice();
  }, []);

  // Hàm xử lý khi nhấn vào bài viết
  const handlePostClick = () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để xem nội dung chi tiết!");
      router.push('/auth/sign-in'); // Chuyển hướng đến trang đăng nhập của bạn
    } else {
      // Nếu đã đăng nhập thì mới cho vào (logic này sẽ dùng khi bạn tích hợp Auth thật)
      // router.push(`/news/${id}`);
    }
  };

  const heroPost = newsData[0];
  const subPosts = newsData.slice(1, 4);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
        <NoAuthNavbar />

        
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* BANNER CHÍNH */}
          <Paper 
            elevation={0} 
            sx={{ 
                borderRadius: 8, overflow: 'hidden', mb: 8, border: '1px solid #E2E8F0',
                display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                cursor: 'pointer', transition: '0.3s',
                '&:hover': { boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
            }}
            onClick={handlePostClick}
          >
            <Box sx={{ width: { xs: '100%', md: '60%' }, height: 450 }}>
                <CardMedia component="img" image={heroPost.image} sx={{ height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ p: 6, width: { xs: '100%', md: '40%' }, bgcolor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="overline" sx={{ color: '#3B82F6', fontWeight: 800 }}>Dành riêng cho thành viên</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E293B', mb: 2, lineHeight: 1.2 }}>
                    {heroPost.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
                    Đăng nhập để đọc các phân tích chuyên sâu về thị trường bất động sản Web3.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#1E293B', borderRadius: 2, py: 1.5, textTransform: 'none' }}>
                    Đăng nhập để xem
                </Button>
            </Box>
          </Paper>

          {/* CÁC TIN PHỤ */}
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 4 }}>Tin tức mới nhất</Typography>

          <Grid container spacing={4}>
            {subPosts.map((post) => (
              <Grid item xs={12} md={4} key={post.id}>
                <Card 
                  elevation={0} 
                  onClick={handlePostClick}
                  sx={{ 
                    borderRadius: 6, border: '1px solid #E2E8F0', cursor: 'pointer', height: '100%',
                    transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" height="200" image={post.image} sx={{ filter: 'blur(1px) brightness(0.8)' }} />
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center', width: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.5, borderRadius: 1 }}>KHÓA</Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                      Nội dung này yêu cầu quyền truy cập thành viên...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}