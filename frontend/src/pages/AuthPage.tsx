import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack, Link } from '@chakra-ui/react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, fetchSignInMethodsForEmail, User as FirebaseUser } from 'firebase/auth';

function validatePassword(password: string) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { user, login, signup, logout } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  // Helper to resolve username to email
  const resolveEmailFromUsername = async (username: string): Promise<string | null> => {
    // Firebase does not support username lookup directly, so we must fetch all users (not possible from client)
    // For demo, require users to login with email or store a username->email map in your backend
    // Here, we try both as email and as username (if username is an email)
    if (username.includes('@')) return username;
    setMessage('Please login with your email address.');
    throw new Error('Login with email required');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!isLogin) {
      if (!validatePassword(password)) {
        setMessage('Password must be at least 8 characters, include a number, an uppercase letter, and a special character.');
        return;
      }
      if (!username.trim()) {
        setMessage('Username is required.');
        return;
      }
    }
    try {
      if (isLogin) {
        // Try to resolve email from username
        const email = await resolveEmailFromUsername(emailOrUsername);
        if (!email) return; // Don't call login if email is null
        await login(email, password);
        navigate('/dashboard');
      } else {
        await signup(emailOrUsername, password, username);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading mb={6} textAlign="center">{isLogin ? 'Login' : 'Sign Up'}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="emailOrUsername" isRequired>
            <FormLabel>{isLogin ? 'Email or Username' : 'Email'}</FormLabel>
            <Input
              type="text"
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              placeholder={isLogin ? 'Email or Username' : 'Email'}
            />
          </FormControl>
          {!isLogin && (
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input value={username} onChange={e => setUsername(e.target.value)} />
            </FormControl>
          )}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="teal" type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
        </VStack>
      </form>
      {message && <Text mt={4} color="red.500">{message}</Text>}
      <Text mt={4} textAlign="center">
        {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
        <Link color="teal.500" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </Link>
      </Text>
    </Box>
  );
};

export default AuthPage; 