import React, { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";
import { useRouter } from "next/router";

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Error resetting password:", error.message);
      return;
    }
    alert("Password reset succeeeded!");
    router.push('/');
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <button type="submit"
        onClick={handleResetPassword}
        >Reset</button>
      </form>
    </div>
  );
}

export default ResetPassword;