import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Input,
  HStack,
  VStack,
  Text,
  Select,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  useDisclosure,
  Tooltip,
  Progress,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiEye, FiFilter, FiTrendingUp, FiSmartphone } from 'react-icons/fi';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

const db = getFirestore(firebaseApp);

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Planned' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  rice: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    score: number;
  };
  tags: string[];
  assignee: string;
  dueDate: string;
  createdAt: string;
  linkedFeedback: number;
}

const FeaturesPage: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('rice');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | undefined>(undefined);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchFeatures();
  }, []);

  useEffect(() => {
    filterAndSortFeatures();
  }, [features, filterStatus, filterPriority, searchTerm, sortBy]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'features'));
      const featuresData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature));
      setFeatures(featuresData);
    } catch (error) {
      console.error('Error fetching features:', error);
      // Mock data for demonstration
      setFeatures([
        {
          id: '1',
          name: 'Mobile App Redesign',
          description: 'Complete redesign of mobile application with new UI/UX',
          status: 'In Progress',
          priority: 'High',
          rice: { reach: 5000, impact: 4, confidence: 80, effort: 8, score: 2000 },
          tags: ['mobile', 'ui/ux'],
          assignee: 'John Doe',
          dueDate: '2024-03-31',
          createdAt: '2024-01-01',
          linkedFeedback: 15
        },
        {
          id: '2',
          name: 'Dark Mode Support',
          description: 'Add dark mode theme across all platforms',
          status: 'Planned',
          priority: 'Medium',
          rice: { reach: 3000, impact: 3, confidence: 90, effort: 4, score: 2025 },
          tags: ['theme', 'accessibility'],
          assignee: 'Jane Smith',
          dueDate: '2024-04-30',
          createdAt: '2024-01-05',
          linkedFeedback: 8
        }
      ]);
    }
    setLoading(false);
  };

  const filterAndSortFeatures = () => {
    let filtered = features.filter(feature => {
      const matchesStatus = filterStatus === 'all' || feature.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || feature.priority === filterPriority;
      const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });

    // Sort features
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rice':
          return b.rice.score - a.rice.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    setFilteredFeatures(filtered);
  };

  const calculateRICEScore = (reach: number, impact: number, confidence: number, effort: number) => {
    return (reach * impact * confidence) / effort;
  };

  const handleAddFeature = async (featureData: Partial<Feature>) => {
    const riceScore = calculateRICEScore(
      featureData.rice?.reach || 0,
      featureData.rice?.impact || 0,
      featureData.rice?.confidence || 0,
      featureData.rice?.effort || 1
    );

    const newFeature = {
      ...featureData,
      rice: {
        ...featureData.rice!,
        score: riceScore
      },
      createdAt: new Date().toISOString(),
      linkedFeedback: 0
    };

    await addDoc(collection(db, 'features'), newFeature);
    await fetchFeatures();
    onClose();
    setEditingFeature(undefined);
  };

  const handleUpdateFeature = async (id: string, updates: Partial<Feature>) => {
    if (updates.rice) {
      updates.rice.score = calculateRICEScore(
        updates.rice.reach,
        updates.rice.impact,
        updates.rice.confidence,
        updates.rice.effort
      );
    }

    await updateDoc(doc(db, 'features', id), updates);
    await fetchFeatures();
    onClose();
    setEditingFeature(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'blue';
      case 'Planned': return 'orange';
      case 'Cancelled': return 'red';
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

  const FeatureForm = ({ feature, onSubmit }: { feature?: Partial<Feature>, onSubmit: (data: Partial<Feature>) => void }) => (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Feature Name</FormLabel>
        <Input
          value={feature?.name || ''}
          onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
          placeholder="Enter feature name"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={feature?.description || ''}
          onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
          placeholder="Describe the feature"
        />
      </FormControl>

      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            value={feature?.status || 'Backlog'}
            onChange={(e) => setEditingFeature({ ...editingFeature, status: e.target.value as Feature['status'] })}
          >
            <option value="Backlog">Backlog</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Priority</FormLabel>
          <Select
            value={feature?.priority || 'Medium'}
            onChange={(e) => setEditingFeature({ ...editingFeature, priority: e.target.value as Feature['priority'] })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Select>
        </FormControl>
      </Grid>

      <Card w="full">
        <CardHeader>
          <Heading size="sm">RICE Scoring</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl>
              <FormLabel>Reach (users/month)</FormLabel>
              <NumberInput
                value={feature?.rice?.reach || 0}
                onChange={(_, value) => setEditingFeature({
                  ...editingFeature,
                  rice: { 
                    reach: editingFeature?.rice?.reach || 0,
                    impact: value,
                    confidence: editingFeature?.rice?.confidence || 0,
                    effort: editingFeature?.rice?.effort || 1
                  }
                })}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Impact (1-5 scale)</FormLabel>
              <NumberInput
                value={feature?.rice?.impact || 0}
                onChange={(_, value) => setEditingFeature({
                  ...editingFeature,
                  rice: { 
                    reach: editingFeature?.rice?.reach || 0,
                    impact: value,
                    confidence: editingFeature?.rice?.confidence || 0,
                    effort: editingFeature?.rice?.effort || 1
                  }
                })}
                min={0}
                max={5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Confidence (0-100%)</FormLabel>
              <NumberInput
                value={feature?.rice?.confidence || 0}
                onChange={(_, value) => setEditingFeature({
                  ...editingFeature,
                  rice: { 
                    reach: editingFeature?.rice?.reach || 0,
                    impact: value,
                    confidence: value,
                    effort: editingFeature?.rice?.effort || 1
                  }
                })}
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

            <FormControl>
              <FormLabel>Effort (person-months)</FormLabel>
              <NumberInput
                value={feature?.rice?.effort || 1}
                onChange={(_, value) => setEditingFeature({
                  ...editingFeature,
                  rice: { 
                    reach: editingFeature?.rice?.reach || 0,
                    impact: value,
                    confidence: editingFeature?.rice?.confidence || 0,
                    effort: value
                  }
                })}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Grid>
          
          {feature?.rice && (
            <Box mt={4} p={3} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold">
                RICE Score: {calculateRICEScore(
                  feature.rice.reach,
                  feature.rice.impact,
                  feature.rice.confidence,
                  feature.rice.effort
                ).toFixed(2)}
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      <FormControl>
        <FormLabel>Assignee</FormLabel>
        <Input
          value={feature?.assignee || ''}
          onChange={(e) => setEditingFeature({ ...editingFeature, assignee: e.target.value })}
          placeholder="Assign to team member"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Due Date</FormLabel>
        <Input
          type="date"
          value={feature?.dueDate || ''}
          onChange={(e) => setEditingFeature({ ...editingFeature, dueDate: e.target.value })}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={() => onSubmit(editingFeature || {})}
        isDisabled={!editingFeature?.name}
        w="full"
      >
        {feature?.id ? 'Update Feature' : 'Add Feature'}
      </Button>
    </VStack>
  );

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>ProductHub Features</Heading>
          <Text fontSize="lg" color="gray.600">Manage and prioritize product features</Text>
        </Box>

        {/* Filters and Search */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(200px, 1fr))' }} gap={4}>
              <FormControl>
                <FormLabel fontSize="sm">Search</FormLabel>
                <Input
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Status</FormLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="Backlog">Backlog</option>
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Priority</FormLabel>
                <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Sort By</FormLabel>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="rice">RICE Score</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </Select>
              </FormControl>
            </Grid>
          </CardBody>
        </Card>

        {/* Features Table */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Feature</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>RICE Score</Th>
                  <Th>Assignee</Th>
                  <Th>Linked Feedback</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFeatures.map((feature) => (
                  <Tr key={feature.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{feature.name}</Text>
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {feature.description}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getPriorityColor(feature.priority)}>
                        {feature.priority}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{feature.rice.score.toFixed(2)}</Text>
                        <Progress
                          value={(feature.rice.score / 2500) * 100}
                          size="sm"
                          colorScheme="blue"
                          w="60px"
                        />
                      </VStack>
                    </Td>
                    <Td>{feature.assignee || '-'}</Td>
                    <Td>
                      <Badge colorScheme="blue">{feature.linkedFeedback}</Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="View Details">
                          <IconButton
                            size="sm"
                            icon={<FiEye />}
                            aria-label="View feature"
                            variant="ghost"
                          />
                        </Tooltip>
                        <Tooltip label="Edit Feature">
                          <IconButton
                            size="sm"
                            icon={<FiEdit2 />}
                            aria-label="Edit feature"
                            variant="ghost"
                            onClick={() => {
                              setEditingFeature(feature);
                              onOpen();
                            }}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Add/Edit Feature Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingFeature?.id ? 'Edit Feature' : 'Add New Feature'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FeatureForm
                feature={editingFeature}
                onSubmit={(data) => {
                  if (editingFeature?.id) {
                    handleUpdateFeature(editingFeature.id, data);
                  } else {
                    handleAddFeature(data);
                  }
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default FeaturesPage; 