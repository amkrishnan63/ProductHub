import React from 'react';
import { Box, Button, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const SplashPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bgGradient="linear(to-br, teal.100, teal.300)">
      <VStack spacing={8} p={10} bg="white" borderRadius="2xl" boxShadow="2xl" align="center">
        <Image src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="Productboard Logo" boxSize="64px" />
        <Heading size="2xl" color="teal.600">Productboard Clone</Heading>
        <Text fontSize="xl" color="gray.600" textAlign="center">
          The all-in-one product management platform for modern teams.<br />
          Prioritize features, capture feedback, and build better products.
        </Text>
        <VStack spacing={4} w="100%">
          {!user && <Button colorScheme="teal" size="lg" w="100%" onClick={() => navigate('/auth')}>Login / Sign Up</Button>}
          {user && <Button colorScheme="teal" size="lg" w="100%" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>}
        </VStack>
      </VStack>
    </Box>
  );
};

export default SplashPage; 