import React, { useState, useEffect } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Flex,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Image,
  Divider,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  FiSmartphone, 
  FiCpu, 
  FiBattery, 
  FiCamera, 
  FiWifi, 
  FiBluetooth,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiSettings,
  FiBarChart,
  FiStar,
  FiAward,
  FiZap,
  FiPlus,
  FiMonitor,
  FiTablet,
  FiWatch,
  FiHeadphones
} from 'react-icons/fi';
import { getFirestore, collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

const db = getFirestore(firebaseApp);

interface Product {
  id: string;
  name: string;
  category: 'iPhone' | 'iPad' | 'Mac' | 'Apple Watch' | 'AirPods' | 'Apple TV' | 'HomePod';
  description: string;
  status: 'In Development' | 'Planning' | 'Released' | 'Discontinued';
  targetDate: string;
  features: ProductFeature[];
  metrics: ProductMetric[];
}

interface ProductFeature {
  id: string;
  name: string;
  description: string;
  category: 'Hardware' | 'Software' | 'Design' | 'Performance' | 'Security';
  status: 'In Development' | 'Testing' | 'Production Ready' | 'Released' | 'Planned';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  progress: number;
  team: string[];
  targetDate: string;
  impact: number;
  effort: number;
}

interface ProductMetric {
  name: string;
  value: string;
  change: number;
  target: string;
  icon: any;
  color: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'features' | 'roadmap' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isProductModalOpen, onOpen: onProductModalOpen, onClose: onProductModalClose } = useDisclosure();
  const [newFeature, setNewFeature] = useState<Partial<ProductFeature>>({
    name: '',
    description: '',
    category: 'Hardware',
    status: 'In Development',
    priority: 'Medium',
    progress: 0,
    team: [] as string[],
    targetDate: '',
    impact: 5,
    effort: 4
  });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'iPhone',
    description: '',
    status: 'In Development',
    targetDate: '',
    features: [],
    metrics: []
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      if (productsData.length === 0) {
        // Initialize with only iPhone 17 Air
        const defaultProducts: Product[] = [
          {
            id: 'iphone-17-air',
            name: 'iPhone 17 Air',
            category: 'iPhone',
            description: 'Ultra-thin, lightweight iPhone with 6.6-inch display and A19 chip',
            status: 'In Development',
            targetDate: '2025-09-10',
            features: [
              {
                id: 'air-1',
                name: 'Ultra-thin Design',
                description: 'Only 5.65mm thick, significantly thinner than iPhone 16.',
                category: 'Design',
                status: 'In Development',
                priority: 'High',
                progress: 60,
                team: ['Design Team'],
                targetDate: '2025-07-01',
                impact: 9,
                effort: 8
              },
              {
                id: 'air-2',
                name: '6.6-inch Display',
                description: 'New display size, bridging standard and Pro models.',
                category: 'Hardware',
                status: 'In Development',
                priority: 'High',
                progress: 55,
                team: ['Display Team'],
                targetDate: '2025-07-15',
                impact: 8,
                effort: 7
              },
              {
                id: 'air-3',
                name: 'A19 Chip',
                description: 'New A19 chip built on 3nm process.',
                category: 'Performance',
                status: 'Planned',
                priority: 'Critical',
                progress: 30,
                team: ['Chip Team'],
                targetDate: '2025-08-01',
                impact: 10,
                effort: 9
              },
              {
                id: 'air-4',
                name: 'Dynamic Island',
                description: 'Front camera and sensors in Dynamic Island cutout.',
                category: 'Hardware',
                status: 'Planned',
                priority: 'Medium',
                progress: 20,
                team: ['Hardware Team'],
                targetDate: '2025-08-15',
                impact: 7,
                effort: 5
              },
              {
                id: 'air-5',
                name: '120Hz ProMotion',
                description: '120Hz refresh rate, always-on display support.',
                category: 'Performance',
                status: 'Planned',
                priority: 'High',
                progress: 15,
                team: ['Performance Team'],
                targetDate: '2025-08-30',
                impact: 8,
                effort: 6
              }
            ],
            metrics: [
              { name: 'Development Progress', value: '65%', change: 12, target: '85%', icon: 'FiTrendingUp', color: 'green' },
              { name: 'Feature Count', value: '23', change: 3, target: '30', icon: 'FiStar', color: 'blue' },
              { name: 'Team Size', value: '45', change: 5, target: '50', icon: 'FiUsers', color: 'purple' },
              { name: 'Budget Used', value: '$2.1M', change: -8, target: '$3M', icon: 'FiBarChart', color: 'orange' }
            ]
          }
        ];
        setProducts(defaultProducts);
        setSelectedProduct(defaultProducts[0]);
      } else {
        setProducts(productsData);
        setSelectedProduct(productsData[0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async () => {
    if (!selectedProduct || !newFeature.name || !newFeature.description) return;

    try {
      const featureData = {
        ...newFeature,
        id: `feature-${Date.now()}`,
        team: newFeature.team || []
      };

      // Add to Firestore
      await addDoc(collection(db, 'product_features'), {
        productId: selectedProduct.id,
        ...featureData
      });

      // Update local state
      const updatedProduct = {
        ...selectedProduct,
        features: [...selectedProduct.features, featureData as ProductFeature]
      };
      
      setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      setSelectedProduct(updatedProduct);
      
      // Reset form
      setNewFeature({
        name: '',
        description: '',
        category: 'Hardware',
        status: 'In Development',
        priority: 'Medium',
        progress: 0,
        team: [],
        targetDate: '',
        impact: 5,
        effort: 4
      });
      onClose();
    } catch (error) {
      console.error('Error adding feature:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description) return;

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        subcategory: newProduct.subcategory || '',
        status: newProduct.status,
        targetDate: newProduct.targetDate,
        features: [],
        metrics: [
          { name: 'Development Progress', value: '0%', change: 0, target: '100%', icon: 'FiTrendingUp', color: 'green' },
          { name: 'Feature Count', value: '0', change: 0, target: '10', icon: 'FiStar', color: 'blue' },
          { name: 'Team Size', value: '0', change: 0, target: '20', icon: 'FiUsers', color: 'purple' },
          { name: 'Budget Used', value: '$0', change: 0, target: '$1M', icon: 'FiBarChart', color: 'orange' }
        ]
      };

      // Add to Firestore
      await addDoc(collection(db, 'products'), productData);

      // Update local state
      const newProductWithId = { ...productData, id: `product-${Date.now()}` } as Product;
      setProducts([...products, newProductWithId]);
      setSelectedProduct(newProductWithId);
      
      // Reset form
      setNewProduct({
        name: '',
        category: 'iPhone',
        description: '',
        status: 'In Development',
        targetDate: '',
        features: [],
        metrics: []
      });
      onProductModalClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(p => p.id !== productId));
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
      }
    } catch (error) {
      alert('Error deleting product: ' + (error as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development': return 'blue';
      case 'Testing': return 'yellow';
      case 'Production Ready': return 'green';
      case 'Released': return 'green';
      case 'Planned': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hardware': return 'blue';
      case 'Software': return 'green';
      case 'Design': return 'purple';
      case 'Performance': return 'orange';
      case 'Security': return 'red';
      default: return 'gray';
    }
  };

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'iPhone': return FiSmartphone;
      case 'iPad': return FiTablet;
      case 'Mac': return FiMonitor;
      case 'Apple Watch': return FiWatch;
      case 'AirPods': return FiHeadphones;
      default: return FiSmartphone;
    }
  };

  // Icon mapping for rendering
  const iconMap: { [key: string]: React.ElementType } = {
    FiTrendingUp,
    FiStar,
    FiUsers,
    FiBarChart,
  };

  if (loading) {
    return (
      <Box p={8}>
        <VStack spacing={4}>
          <Text>Loading Apple products...</Text>
        </VStack>
      </Box>
    );
  }

  const ProductOverview = () => (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={getProductIcon(selectedProduct?.category || 'iPhone')} boxSize={6} color="blue.500" />
            <Heading size="md">{selectedProduct?.name}</Heading>
            <Badge colorScheme={selectedProduct?.status === 'Released' ? 'green' : 'blue'}>
              {selectedProduct?.status}
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <Text mb={4}>{selectedProduct?.description}</Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {selectedProduct?.metrics.map((metric, index) => (
              <Stat key={index}>
                <StatLabel>{metric.name}</StatLabel>
                <StatNumber color={metric.color + '.500'}>{metric.value}</StatNumber>
                <StatHelpText>
                  <StatArrow type={metric.change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(metric.change)}%
                </StatHelpText>
              </Stat>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Recent Features</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              {selectedProduct?.features.slice(0, 3).map((feature) => (
                <Box key={feature.id} p={3} border="1px" borderColor={borderColor} borderRadius="md">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">{feature.name}</Text>
                    <Badge colorScheme={getStatusColor(feature.status)}>{feature.status}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={2}>{feature.description}</Text>
                  <Progress value={feature.progress} size="sm" mb={2} />
                  <Text fontSize="xs" color="gray.500">{feature.progress}% complete</Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Development Timeline</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600">Target Release</Text>
                <Text fontWeight="bold">{selectedProduct?.targetDate}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Features in Development</Text>
                <Text fontWeight="bold">{selectedProduct?.features.filter(f => f.status === 'In Development').length}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Completed Features</Text>
                <Text fontWeight="bold">{selectedProduct?.features.filter(f => f.status === 'Released').length}</Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </VStack>
  );

  const FeaturesView = () => (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Features</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
          Add Feature
        </Button>
      </HStack>

      {selectedProduct?.features.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>No features yet!</AlertTitle>
            <AlertDescription>
              Start by adding features to {selectedProduct?.name}.
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(auto-fit, minmax(400px, 1fr))' }} gap={6}>
          {selectedProduct?.features.map((feature) => (
            <Card key={feature.id}>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">{feature.name}</Heading>
                  <HStack>
                    <Badge colorScheme={getStatusColor(feature.status)}>{feature.status}</Badge>
                    <Badge colorScheme={getPriorityColor(feature.priority)}>{feature.priority}</Badge>
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text mb={4}>{feature.description}</Text>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>Progress</Text>
                    <Progress value={feature.progress} size="lg" colorScheme="blue" />
                    <Text fontSize="sm" mt={1}>{feature.progress}% complete</Text>
                  </Box>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.600">Target Date</Text>
                      <Text fontWeight="bold">{feature.targetDate}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Team</Text>
                      <Text fontWeight="bold">{feature.team.join(', ')}</Text>
                    </Box>
                  </HStack>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.600">Impact</Text>
                      <Text fontWeight="bold">{feature.impact}/10</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Effort</Text>
                      <Text fontWeight="bold">{feature.effort}/10</Text>
                    </Box>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </VStack>
  );

  const RoadmapView = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Product Roadmap</Heading>
      
      {selectedProduct?.features.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>No roadmap data!</AlertTitle>
            <AlertDescription>
              Add features to see the roadmap for {selectedProduct?.name}.
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(auto-fit, minmax(300px, 1fr))' }} gap={6}>
          {['Planned', 'In Development', 'Testing', 'Production Ready', 'Released'].map((status) => (
            <Card key={status}>
              <CardHeader>
                <Heading size="md">{status}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {selectedProduct?.features.filter(f => f.status === status).length} features
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {selectedProduct?.features
                    .filter(f => f.status === status)
                    .map((feature) => (
                      <Box key={feature.id} p={3} border="1px" borderColor={borderColor} borderRadius="md">
                        <Text fontWeight="bold" mb={1}>{feature.name}</Text>
                        <Text fontSize="sm" color="gray.600" mb={2}>{feature.description}</Text>
                        <HStack justify="space-between">
                          <Badge colorScheme={getPriorityColor(feature.priority)}>{feature.priority}</Badge>
                          <Text fontSize="sm" color="gray.500">{feature.targetDate}</Text>
                        </HStack>
                      </Box>
                    ))}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </VStack>
  );

  const AnalyticsView = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Analytics</Heading>
      
      {selectedProduct?.features.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          <Box>
            <AlertTitle>No analytics data!</AlertTitle>
            <AlertDescription>
              Add features to see analytics for {selectedProduct?.name}.
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(auto-fit, minmax(300px, 1fr))' }} gap={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Feature Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {['Planned', 'In Development', 'Testing', 'Production Ready', 'Released'].map((status) => {
                  const count = selectedProduct?.features.filter(f => f.status === status).length || 0;
                  const percentage = selectedProduct?.features.length ? (count / selectedProduct.features.length) * 100 : 0;
                  return (
                    <Box key={status}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm">{status}</Text>
                        <Text fontSize="sm" fontWeight="bold">{count}</Text>
                      </HStack>
                      <Progress value={percentage} size="sm" colorScheme={getStatusColor(status)} />
                    </Box>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Priority Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {['Critical', 'High', 'Medium', 'Low'].map((priority) => {
                  const count = selectedProduct?.features.filter(f => f.priority === priority).length || 0;
                  const percentage = selectedProduct?.features.length ? (count / selectedProduct.features.length) * 100 : 0;
                  return (
                    <Box key={priority}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm">{priority}</Text>
                        <Text fontSize="sm" fontWeight="bold">{count}</Text>
                      </HStack>
                      <Progress value={percentage} size="sm" colorScheme={getPriorityColor(priority)} />
                    </Box>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Average Progress by Category</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {['Hardware', 'Software', 'Design', 'Performance', 'Security'].map((category) => {
                  const categoryFeatures = selectedProduct?.features.filter(f => f.category === category) || [];
                  const avgProgress = categoryFeatures.length > 0 
                    ? categoryFeatures.reduce((sum, f) => sum + f.progress, 0) / categoryFeatures.length 
                    : 0;
                  return (
                    <Box key={category}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm">{category}</Text>
                        <Text fontSize="sm" fontWeight="bold">{Math.round(avgProgress)}%</Text>
                      </HStack>
                      <Progress value={avgProgress} size="sm" colorScheme={getCategoryColor(category)} />
                    </Box>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      )}
    </VStack>
  );

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>ProductHub</Heading>
          <Text fontSize="lg" color="gray.600">Manage your products</Text>
        </Box>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Select Product</Heading>
              <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onProductModalOpen}>
                Add Product
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  cursor="pointer"
                  border={selectedProduct?.id === product.id ? '2px solid' : '1px solid'}
                  borderColor={selectedProduct?.id === product.id ? 'blue.500' : borderColor}
                  onClick={() => setSelectedProduct(product)}
                  _hover={{ borderColor: 'blue.300' }}
                >
                  <CardBody>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{product.name}</Text>
                        <Text fontSize="sm" color="gray.600">{product.category}</Text>
                        <Badge colorScheme={product.status === 'Released' ? 'green' : 'blue'} size="sm">
                          {product.status}
                        </Badge>
                      </VStack>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {selectedProduct && (
          <Card>
            <CardHeader>
              <Tabs index={['overview', 'features', 'roadmap', 'analytics'].indexOf(selectedView)} onChange={(index) => setSelectedView(['overview', 'features', 'roadmap', 'analytics'][index] as any)}>
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Features</Tab>
                  <Tab>Roadmap</Tab>
                  <Tab>Analytics</Tab>
                </TabList>
              </Tabs>
            </CardHeader>
            <CardBody>
              <Tabs index={['overview', 'features', 'roadmap', 'analytics'].indexOf(selectedView)}>
                <TabPanels>
                  <TabPanel>
                    <ProductOverview />
                  </TabPanel>
                  <TabPanel>
                    <FeaturesView />
                  </TabPanel>
                  <TabPanel>
                    <RoadmapView />
                  </TabPanel>
                  <TabPanel>
                    <AnalyticsView />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        )}

        {/* Add Feature Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Feature</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Feature Name</FormLabel>
                  <Input 
                    value={newFeature.name} 
                    onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                    placeholder="Enter feature name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    value={newFeature.description} 
                    onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                    placeholder="Describe the feature"
                  />
                </FormControl>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      value={newFeature.category} 
                      onChange={(e) => setNewFeature({...newFeature, category: e.target.value as any})}
                    >
                      <option value="Hardware">Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Design">Design</option>
                      <option value="Performance">Performance</option>
                      <option value="Security">Security</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={newFeature.status} 
                      onChange={(e) => setNewFeature({...newFeature, status: e.target.value as any})}
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Development">In Development</option>
                      <option value="Testing">Testing</option>
                      <option value="Production Ready">Production Ready</option>
                      <option value="Released">Released</option>
                    </Select>
                  </FormControl>
                </HStack>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      value={newFeature.priority} 
                      onChange={(e) => setNewFeature({...newFeature, priority: e.target.value as any})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Progress (%)</FormLabel>
                    <NumberInput 
                      value={newFeature.progress} 
                      onChange={(_, value) => setNewFeature({...newFeature, progress: value})}
                      min={0}
                      max={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Target Date</FormLabel>
                    <Input 
                      type="date"
                      value={newFeature.targetDate} 
                      onChange={(e) => setNewFeature({...newFeature, targetDate: e.target.value})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Team (comma-separated)</FormLabel>
                    <Input 
                      value={newFeature.team?.join(', ') || ''} 
                      onChange={(e) => setNewFeature({...newFeature, team: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="Design Team, Engineering Team"
                    />
                  </FormControl>
                </HStack>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Impact (1-10)</FormLabel>
                    <NumberInput 
                      value={newFeature.impact} 
                      onChange={(_, value) => setNewFeature({...newFeature, impact: value})}
                      min={1}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Effort (1-10)</FormLabel>
                    <NumberInput 
                      value={newFeature.effort} 
                      onChange={(_, value) => setNewFeature({...newFeature, effort: value})}
                      min={1}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAddFeature}>
                Add Feature
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Product Modal */}
        <Modal isOpen={isProductModalOpen} onClose={onProductModalClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    value={newProduct.description} 
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Describe the product"
                  />
                </FormControl>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any, subcategory: ''})}
                    >
                      <option value="">Select a category</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Earbuds">Earbuds</option>
                      <option value="Speaker">Speaker</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Printer">Printer</option>
                      <option value="Router">Router</option>
                      <option value="Camera">Camera</option>
                      <option value="Projector">Projector</option>
                      <option value="Game Console">Game Console</option>
                      <option value="VR Headset">VR Headset</option>
                      <option value="Drone">Drone</option>
                      <option value="Fitness Tracker">Fitness Tracker</option>
                      <option value="Smart Home Hub">Smart Home Hub</option>
                      <option value="E-Reader">E-Reader</option>
                      <option value="Smart Light">Smart Light</option>
                      <option value="Smart Thermostat">Smart Thermostat</option>
                      <option value="Security Camera">Security Camera</option>
                      <option value="NAS">NAS</option>
                      <option value="3D Printer">3D Printer</option>
                    </Select>
                  </FormControl>
                  {newProduct.category && (
                    <FormControl mt={2}>
                      <FormLabel>Subcategory</FormLabel>
                      <Input
                        value={newProduct.subcategory || ''}
                        onChange={e => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                        placeholder={`Enter a subcategory for ${newProduct.category}`}
                      />
                    </FormControl>
                  )}
                </HStack>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={newProduct.status} 
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value as any})}
                    >
                      <option value="In Development">In Development</option>
                      <option value="Planning">Planning</option>
                      <option value="Released">Released</option>
                      <option value="Discontinued">Discontinued</option>
                    </Select>
                  </FormControl>
                </HStack>
                <HStack spacing={4} width="100%">
                  <FormControl>
                    <FormLabel>Target Release Date</FormLabel>
                    <Input 
                      type="date"
                      value={newProduct.targetDate} 
                      onChange={(e) => setNewProduct({...newProduct, targetDate: e.target.value})}
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onProductModalClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAddProduct}>
                Add Product
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default ProductsPage; 