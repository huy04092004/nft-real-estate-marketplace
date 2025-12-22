import { React } from 'react';
import Link from 'next/link';
import { Toolbar, Button, AppBar, Grid, Box, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useTranslation } from 'react-i18next';

const AuthNavbar = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { data: userData } = useAccount();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSingOut = async () => {
      const data = await signOut({ redirect: false, callbackUrl: '/'})
      router.push(data.url)
  }

  return (
    <Box sx={{ margin: 10 }}>
        <AppBar position="fixed" style={{ backgroundColor:"#455a64"}} >
          <Toolbar>
            <Box 
              component="img" 
              src="/logo2.png" 
              sx={{ width: 180, height: 70, marginRight: 10, cursor: 'pointer' }}
              onClick={() => router.push('/main')}
            />
            <Grid
                justify="space-between"
                container 
                spacing={2}
                justifyContent="center"
            >
                <Grid item>
                    <Link href="/main" style={{ textDecoration: 'none', color: 'white'}}>
                      <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 15 }}>
                        {t("navbar_home")}
                      </Button>
                    </Link>
                </Grid>

                 <Grid item>
                    <Link href="/news" style={{ textDecoration: 'none', color: 'white', }}>
                      <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 15 }}>
                        {t("Tin tức mới")}
                      </Button>
                    </Link>
                </Grid> 

                {/* --- NÚT MY ASSETS MỚI THÊM --- */}
                <Grid item>
                    <Link href="/my-assets" style={{ textDecoration: 'none', color: 'white', }}>
                      <Button 
                        variant="inherit" 
                        sx={{ 
                          textTransform: 'none', 
                          fontSize: 15,
                          fontWeight: router.pathname === '/my-assets' ? 'bold' : 'normal',
                          backgroundColor: router.pathname === '/my-assets' ? 'rgba(255,255,255,0.1)' : 'transparent'
                        }}
                      >
                        {/* Bạn hãy thêm key "navbar_my_assets" vào file dịch i18n của bạn */}
                        {t("Tài sản của tôi") || "My Assets"}
                      </Button>
                    </Link>
                </Grid>
                {/* ---------------------------- */}

                <Grid item>
                    <Link href="/ai-assistant" style={{ textDecoration: 'none', color: 'white', }}>
                      <Button 
                        variant="inherit" 
                        sx={{ 
                          textTransform: 'none', 
                          fontSize: 15,
                          fontWeight: router.pathname === '/ai-assistant' ? 'bold' : 'normal',
                          backgroundColor: router.pathname === '/ai-assistant' ? 'rgba(255,255,255,0.1)' : 'transparent'
                        }}
                      >
                        {t("Tư vấn AI") || ""}
                      </Button>
                    </Link>
                </Grid>

                
                <Grid item>
                    <Link href="/sell-property" style={{ textDecoration: 'none', color: 'white', }}>
                      <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 15 }}>
                        {t("navbar_sell_property")}
                      </Button>
                    </Link>
                </Grid>     
                  <Grid item>
                    <Link href="/profile" style={{ textDecoration: 'none', color: 'white', }}>
                      <Button variant="inherit" sx={{ textTransform: 'none', fontSize: 15 }}>
                        {t("navbar_profile")}
                      </Button>
                    </Link>
                </Grid>      
            </Grid>

            {userData ?
              <Typography color="white" sx={{ marginRight: 1 }}>
                {userData.address.slice(0, 5) + "...." + userData.address.slice(userData.address.length - 5, userData.address.length)}
              </Typography>
              :
              <Button
                onClick={() => connect()}
                sx={{
                  backgroundColor: '#37474f',
                  textTransform: 'none',
                  color: 'white',
                  ':hover': { bgcolor: '#546e7a' },
                  width: 180,
                  height: 40
                }}
              >
                {t("connect_wallet_button")}
            </Button>
            }
            <Button startIcon={<LogoutIcon />} onClick={handleSingOut} sx={{ marginLeft: 5 }} variant="inherit">
              {t("navbar_logout")}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
  );
}

export default AuthNavbar;