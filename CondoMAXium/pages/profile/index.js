import React, { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useRouter } from "next/router";

import Head from "next/head";

import {
  Typography,
  Container,
  Box,
  Avatar,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import styles from "../../styles/profile.module.css";

const ProfilePage = () => {
  const router = useRouter();
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user || !user.email) {
          throw new Error("User email not found; User might not be logged in.");
        }

        const userEmail = user.email;

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
            .from("profiles")
            .select("roleOfUser")
            .eq("emailProfile", userEmail)
            .single();

        if (roleError || !roleData) {
          throw new Error("Error fetching user role.");
        }

        setRole(roleData.roleOfUser);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("emailProfile", userEmail);

        if (profileError || !profileData.length) {
          throw new Error("Error fetching profile data.");
        }

        // Fetch phone number from units table only if role is not 'cmc'
        if (roleData.roleOfUser === 'owner') {
          const { data: unitData, error: unitError } = await supabase
              .from("units")
              .select("owner_phone")
              .eq("emailUnit", userEmail);

          if (unitError || !unitData.length) {
            throw new Error("Owner phone number not found.");
          }

          setUserObject({
            name: profileData[0].first_name.concat(" ", profileData[0].last_name),
            email: userEmail,
            phone: unitData[0].owner_phone,
          });
        }
        else if (roleData.roleOfUser === 'tenant') {
          const { data: unitData, error: unitError } = await supabase
              .from("units")
              .select("tenant_phone")
              .eq("tenant_email", userEmail);

          if (unitError || !unitData.length) {
            throw new Error("Tenant phone number not found.");
          }

          setUserObject({
            name: profileData[0].first_name.concat(" ", profileData[0].last_name),
            email: userEmail,
            phone: unitData[0].tenant_phone,
          });
        } else {
          setUserObject({
            name: profileData[0].first_name.concat(" ", profileData[0].last_name),
            email: userEmail,
            phone: '', // No phone number for CMC role
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
          <CircularProgress />
        </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <>
      <Head>
          <script
            id="sc-script"
            src="https://cdn.smartcat-proxy.com/60a29c2d1d4341e38fbb9d3f4a3bef3d/script-v1/__translator.js?hash=7e6e37c59d0bf7e0a6f687b25f488757"
          ></script>
        </Head>
        <Header />
        <Box className={styles.outerContainer}>
          <Container className={styles.profileContainer} maxWidth={false}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className={styles.profileBox}>
                  <Avatar
                      alt={userObject.name}
                      src=""
                      sx={{ width: 95, height: 95, margin: "0 auto" }}
                  />
                  <Typography
                      variant="h4"
                      component="h1"
                      className={styles.profileHeader}
                      gutterBottom
                  >
                    {userObject.name}
                  </Typography>
                  <Box className={styles.profileDetails} sx={{ textAlign: "center" }}>
                    <Typography variant="h6"><strong>Email:</strong><br />{userObject.email}<br /><br /></Typography>
                    {role !== 'cmc' && <Typography variant="h6"><strong>Phone:</strong><br />{userObject.phone}<br /><br /></Typography>}
                  </Box>
                  <Box className={styles.logoutButtonContainer}>
                    <Button
                        className={styles.button}
                        variant="contained"
                        color="error"
                        onClick={async () => {
                          try {
                            router.push("/");
                            const { error } = await supabase.auth.signOut();
                            if (error) throw new Error("Error signing out");
                            localStorage.clear();
                            sessionStorage.clear();
                          } catch (error) {
                            console.error("Error signing out:", error.message);
                          }
                        }}
                    >
                      Logout
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
      </>
  );
};

export default ProfilePage;
