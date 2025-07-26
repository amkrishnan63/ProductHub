import React from 'react';
import { Box, Flex, HStack, Link, Menu, MenuButton, MenuList, MenuItem, Button, Text, Heading } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'contributor', 'viewer'] },
  { to: '/products', label: 'Products', roles: ['admin', 'contributor'] },
  { to: '/features', label: 'Features', roles: ['admin', 'contributor'] },
  { to: '/feedback', label: 'Feedback', roles: ['admin', 'contributor', 'viewer'] },
  { to: '/roadmap', label: 'Roadmap', roles: ['admin', 'contributor'] },
  { to: '/reporting', label: 'Reporting', roles: ['admin'] },
  { to: '/integrations', label: 'Integrations', roles: ['admin'] },
];

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  // NavBar is now always visible, even on /auth

  return (
    <Box bg="gray.100" px={4} boxShadow="sm">
      <Flex h={12} alignItems="center" justifyContent="space-between">
        <Box>
          <Heading size="lg" color="blue.500">ProductHub</Heading>
        </Box>
        <HStack spacing={8} alignItems="center">
          {links.filter(link => user && link.roles.includes(user.role)).map((link) => (
            <Link
              as={NavLink}
              key={link.to}
              to={link.to}
              px={2}
              py={1}
              rounded="md"
              _hover={{ textDecoration: 'none', bg: 'gray.200' }}
              _activeLink={{ color: 'teal.500', fontWeight: 'bold' }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>
        <HStack>
          {user && (
            <>
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  <Text>Welcome, {user.username} ({user.role})</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
              <Button colorScheme="teal" variant="outline" size="sm" ml={2} onClick={logout}>
                Sign Out
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavBar; 