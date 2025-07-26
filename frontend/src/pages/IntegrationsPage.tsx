import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Grid,
  GridItem,
  Avatar,
  useColorModeValue,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { 
  FiSlack, 
  FiMessageSquare, 
  FiGithub, 
  FiTrello,
  FiZap,
  FiSettings,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiPlus
} from 'react-icons/fi';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Communication' | 'Development' | 'Analytics' | 'Support' | 'Design';
  status: 'Connected' | 'Disconnected' | 'Configured';
  isEnabled: boolean;
  lastSync?: string;
  syncStatus?: 'success' | 'error' | 'pending';
  config?: {
    webhookUrl?: string;
    apiKey?: string;
    channel?: string;
  };
}

const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and share updates with your team',
      icon: FiSlack,
      category: 'Communication',
      status: 'Connected',
      isEnabled: true,
      lastSync: '2 minutes ago',
      syncStatus: 'success',
      config: {
        channel: '#product-updates'
      }
    },
    {
      id: 'intercom',
      name: 'Intercom',
      description: 'Sync customer conversations and feedback',
      icon: FiMessageSquare,
      category: 'Support',
      status: 'Configured',
      isEnabled: false,
      lastSync: '1 hour ago',
      syncStatus: 'error'
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Connect issues and track development progress',
      icon: FiGithub,
      category: 'Development',
      status: 'Connected',
      isEnabled: true,
      lastSync: '5 minutes ago',
      syncStatus: 'success'
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Sync boards and track project progress',
      icon: FiTrello,
      category: 'Development',
      status: 'Disconnected',
      isEnabled: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      icon: FiZap,
      category: 'Analytics',
      status: 'Configured',
      isEnabled: true,
      lastSync: '30 minutes ago',
      syncStatus: 'success'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, isEnabled: !integration.isEnabled }
          : integration
      )
    );
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'green';
      case 'Configured': return 'blue';
      case 'Disconnected': return 'gray';
      default: return 'gray';
    }
  };

  const getSyncStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Communication': return 'blue';
      case 'Development': return 'purple';
      case 'Analytics': return 'teal';
      case 'Support': return 'orange';
      case 'Design': return 'pink';
      default: return 'gray';
    }
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
    <Card bg={bgColor} border="1px" borderColor={borderColor} h="full">
      <CardBody>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <HStack spacing={3}>
              <Avatar 
                icon={<Icon as={integration.icon} />} 
                bg={getCategoryColor(integration.category) + '.100'}
                color={getCategoryColor(integration.category) + '.600'}
              />
              <Box>
                <Heading size="md">{integration.name}</Heading>
                <Text fontSize="sm" color="gray.500">{integration.description}</Text>
              </Box>
            </HStack>
            <Badge colorScheme={getStatusColor(integration.status)}>
              {integration.status}
            </Badge>
          </HStack>

          <HStack spacing={2}>
            <Badge colorScheme={getCategoryColor(integration.category)} size="sm">
              {integration.category}
            </Badge>
            {integration.syncStatus && (
              <Badge colorScheme={getSyncStatusColor(integration.syncStatus)} size="sm">
                {integration.syncStatus === 'success' ? 'Synced' : 
                 integration.syncStatus === 'error' ? 'Error' : 'Pending'}
              </Badge>
            )}
          </HStack>

          {integration.lastSync && (
            <Text fontSize="sm" color="gray.500">
              Last sync: {integration.lastSync}
            </Text>
          )}

          <Divider />

          <HStack justify="space-between" w="full">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor={`toggle-${integration.id}`} mb="0" fontSize="sm">
                Enable Integration
              </FormLabel>
              <Switch
                id={`toggle-${integration.id}`}
                isChecked={integration.isEnabled}
                onChange={() => handleToggleIntegration(integration.id)}
                colorScheme="blue"
              />
            </FormControl>
            
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Icon as={FiSettings} />}
                onClick={() => handleConfigureIntegration(integration)}
              >
                Configure
              </Button>
              {integration.status === 'Connected' && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FiExternalLink} />}
                >
                  View
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const ConfigurationModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Configure {selectedIntegration?.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedIntegration && (
            <VStack spacing={4} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Integration Setup</AlertTitle>
                  <AlertDescription>
                    Configure your {selectedIntegration.name} integration to sync data with your product management platform.
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl>
                <FormLabel>Webhook URL</FormLabel>
                <Input 
                  placeholder="https://hooks.slack.com/services/..."
                  value={selectedIntegration.config?.webhookUrl || ''}
                />
              </FormControl>

              <FormControl>
                <FormLabel>API Key</FormLabel>
                <Input 
                  type="password"
                  placeholder="Enter your API key"
                  value={selectedIntegration.config?.apiKey || ''}
                />
              </FormControl>

              {selectedIntegration.id === 'slack' && (
                <FormControl>
                  <FormLabel>Channel</FormLabel>
                  <Input 
                    placeholder="#product-updates"
                    value={selectedIntegration.config?.channel || ''}
                  />
                </FormControl>
              )}

              <HStack spacing={4}>
                <Button colorScheme="blue" flex={1}>
                  Test Connection
                </Button>
                <Button variant="outline" flex={1}>
                  Save Configuration
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  const IntegrationStats = () => (
    <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={2}>
            <Icon as={FiCheckCircle} boxSize={8} color="green.500" />
            <Text fontSize="2xl" fontWeight="bold">
              {integrations.filter(i => i.status === 'Connected').length}
            </Text>
            <Text fontSize="sm" color="gray.500">Connected</Text>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={2}>
            <Icon as={FiSettings} boxSize={8} color="blue.500" />
            <Text fontSize="2xl" fontWeight="bold">
              {integrations.filter(i => i.status === 'Configured').length}
            </Text>
            <Text fontSize="sm" color="gray.500">Configured</Text>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={2}>
            <Icon as={FiXCircle} boxSize={8} color="gray.500" />
            <Text fontSize="2xl" fontWeight="bold">
              {integrations.filter(i => i.status === 'Disconnected').length}
            </Text>
            <Text fontSize="sm" color="gray.500">Disconnected</Text>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={2}>
            <Icon as={FiZap} boxSize={8} color="purple.500" />
            <Text fontSize="2xl" fontWeight="bold">
              {integrations.filter(i => i.isEnabled).length}
            </Text>
            <Text fontSize="sm" color="gray.500">Active</Text>
          </VStack>
        </CardBody>
      </Card>
    </Grid>
  );

  const categories = ['All', 'Communication', 'Development', 'Analytics', 'Support', 'Design'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Integrations</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue">
          Add Integration
        </Button>
      </Flex>

      <IntegrationStats />

      {/* Category Filter */}
      <HStack spacing={4} mb={6} overflowX="auto">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'solid' : 'outline'}
            colorScheme="blue"
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </HStack>

      {/* Integrations Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {filteredIntegrations.map(integration => (
          <GridItem key={integration.id}>
            <IntegrationCard integration={integration} />
          </GridItem>
        ))}
      </Grid>

      <ConfigurationModal />
    </Box>
  );
};

export default IntegrationsPage; 