import { React, useEffect, useState } from 'react';
import { Card, CardContent, Container, Grid, Typography, Box, Divider, Button, Avatar, Paper, Stack } from "@mui/material";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer"; // Thêm Footer cho đồng bộ
import { useSession } from 'next-auth/react'
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { isConnected, connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { data: userData } = useAccount();

  const router = useRouter()
  const { t } = useTranslation();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      setTimeout(() => {
        router.push('/')
      }, 3000)
    },
  })

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#64748B' }}>{t("loading_message")}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AuthNavbar />
      
      <Box sx={{ flexGrow: 1, pt: 15, pb: 10 }}>
        <Container maxWidth="md">
          {/* Header Profile */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E293B', mb: 1 }}>
              Hồ sơ cá nhân
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Quản lý thông tin tài khoản và ví lưu trữ của bạn
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Cột trái: Avatar & Ảnh đại diện */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ 
                p: 4, borderRadius: 6, textAlign: 'center',
                border: '1px solid #E2E8F0',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)'
              }}>
                <Avatar sx={{ 
                  width: 120, height: 120, mx: 'auto', mb: 2,
                  bgcolor: '#4F46E5', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)'
                }}>
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
                  {session?.user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                  Thành viên Web3
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  onClick={() => router.push('/')}
                >
                  Về trang chủ
                </Button>
              </Paper>
            </Grid>

            {/* Cột phải: Thông tin chi tiết */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Card Thông tin chung */}
                <Paper elevation={0} sx={{ 
                  p: 3, borderRadius: 6, border: '1px solid #E2E8F0',
                  background: 'white'
                }}>
                  <Typography variant="subtitle2" sx={{ color: '#4F46E5', fontWeight: 700, mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Thông tin cơ bản
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <BadgeIcon sx={{ color: '#94A3B8' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>{t("profile_name_field")}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{session?.user?.name}</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <EmailIcon sx={{ color: '#94A3B8' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>Email</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{session?.user?.email}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>

                {/* Card Wallet */}
                <Paper elevation={0} sx={{ 
                  p: 3, borderRadius: 6, border: '1px solid #E2E8F0',
                  background: isConnected ? 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)' : 'white'
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="subtitle2" sx={{ color: '#4F46E5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Địa chỉ ví Blockchain
                    </Typography>
                    <Box sx={{ 
                      width: 10, height: 10, borderRadius: '50%', 
                      bgcolor: isConnected ? '#10B981' : '#F59E0B',
                      boxShadow: isConnected ? '0 0 10px #10B981' : 'none'
                    }} />
                  </Box>

                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AccountBalanceWalletIcon sx={{ color: isConnected ? '#4F46E5' : '#94A3B8', fontSize: 32 }} />
                        <Box>
                          {userData ? (
                            <Typography sx={{ fontWeight: 700, color: '#1E293B', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                              {userData.address.slice(0, 6) + "..." + userData.address.slice(-6)}
                            </Typography>
                          ) : (
                            <Typography sx={{ color: '#64748B', fontWeight: 500 }}>
                              {t("profile_walletAddress_message")}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant={isConnected ? "outlined" : "contained"}
                        onClick={() => isConnected ? disconnect() : connect()}
                        sx={{ 
                          borderRadius: 3, 
                          textTransform: 'none', 
                          fontWeight: 700,
                          py: 1.2,
                          bgcolor: isConnected ? 'transparent' : '#1E293B',
                          color: isConnected ? '#EF4444' : 'white',
                          borderColor: isConnected ? '#FECACA' : 'transparent',
                          '&:hover': {
                            bgcolor: isConnected ? '#FEF2F2' : '#000',
                            borderColor: isConnected ? '#EF4444' : 'transparent',
                          }
                        }}
                      >
                        {isConnected ? t("disconnect_wallet_button") : t("connect_wallet_button")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Profile;