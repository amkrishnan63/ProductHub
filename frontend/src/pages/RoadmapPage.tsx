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
  Select,
  Flex,
  Grid,
  GridItem,
  Progress,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiUsers, 
  FiTarget, 
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiPause,
  FiPlus,
  FiBarChart
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

const db = getFirestore(firebaseApp);

interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate: string;
  endDate: string;
  progress: number;
  assignees: string[];
  category: 'Feature' | 'Epic' | 'Initiative' | 'Release';
  effort: number;
  impact: number;
}

const RoadmapPage: React.FC = () => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [viewMode, setViewMode] = useState<'timeline' | 'board' | 'list'>('timeline');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1 2024');
  const [showCharts, setShowCharts] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'roadmap'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadmapItem));
      setRoadmapItems(items);
    } catch (error) {
      console.error('Error fetching roadmap data:', error);
      // Mock data for demonstration
      setRoadmapItems([
        {
          id: '1',
          name: 'Mobile App Redesign',
          description: 'Complete redesign of mobile application with new UI/UX',
          status: 'In Progress',
          priority: 'High',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          progress: 65,
          assignees: ['John Doe', 'Jane Smith'],
          category: 'Feature',
          effort: 8,
          impact: 9
        },
        {
          id: '2',
          name: 'Dark Mode Support',
          description: 'Add dark mode theme across all platforms',
          status: 'Not Started',
          priority: 'Medium',
          startDate: '2024-02-01',
          endDate: '2024-04-30',
          progress: 0,
          assignees: ['Mike Johnson'],
          category: 'Feature',
          effort: 4,
          impact: 7
        },
        {
          id: '3',
          name: 'Advanced Analytics Dashboard',
          description: 'Comprehensive analytics and reporting system',
          status: 'On Hold',
          priority: 'Critical',
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          progress: 25,
          assignees: ['Sarah Wilson', 'Alex Brown'],
          category: 'Epic',
          effort: 12,
          impact: 10
        },
        {
          id: '4',
          name: 'API Integration Hub',
          description: 'Centralized API management and integration platform',
          status: 'Completed',
          priority: 'High',
          startDate: '2023-10-01',
          endDate: '2024-01-31',
          progress: 100,
          assignees: ['David Lee'],
          category: 'Initiative',
          effort: 6,
          impact: 8
        }
      ]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'blue';
      case 'On Hold': return 'orange';
      case 'Not Started': return 'gray';
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
      case 'Feature': return 'blue';
      case 'Epic': return 'purple';
      case 'Initiative': return 'teal';
      case 'Release': return 'green';
      default: return 'gray';
    }
  };

  const TimelineView = () => (
    <Box>
      <VStack spacing={6} align="stretch">
        {roadmapItems.map((item) => (
          <Card key={item.id} bg={bgColor} border="1px" borderColor={borderColor}>
            <CardBody>
              <Grid templateColumns="1fr 200px 150px 100px" gap={4} alignItems="center">
                <Box>
                  <HStack spacing={3} mb={2}>
                    <Badge colorScheme={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <Badge colorScheme={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <Badge colorScheme={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </HStack>
                  <Heading size="md" mb={2}>{item.name}</Heading>
                  <Text color="gray.600" mb={3}>{item.description}</Text>
                  <HStack spacing={4}>
                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text fontSize="sm">
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiUsers} />
                      <AvatarGroup size="sm" max={3}>
                        {item.assignees.map((assignee, index) => (
                          <Avatar key={index} name={assignee} />
                        ))}
                      </AvatarGroup>
                    </HStack>
                  </HStack>
                </Box>
                
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2}>Progress</Text>
                  <Progress value={item.progress} colorScheme="blue" size="lg" />
                  <Text fontSize="sm" mt={1}>{item.progress}%</Text>
                </Box>

                <Box>
                  <VStack spacing={1}>
                    <Stat size="sm">
                      <StatLabel fontSize="xs">Impact</StatLabel>
                      <StatNumber fontSize="lg">{item.impact}/10</StatNumber>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel fontSize="xs">Effort</StatLabel>
                      <StatNumber fontSize="lg">{item.effort}w</StatNumber>
                    </Stat>
                  </VStack>
                </Box>

                <Box>
                  <Button size="sm" colorScheme="blue" variant="outline">
                    View Details
                  </Button>
                </Box>
              </Grid>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );

  const BoardView = () => (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {['Not Started', 'In Progress', 'On Hold', 'Completed'].map((status) => (
        <Box key={status}>
          <Heading size="md" mb={4} color={getStatusColor(status) + '.600'}>
            {status}
          </Heading>
          <VStack spacing={3} align="stretch">
            {roadmapItems
              .filter(item => item.status === status)
              .map((item) => (
                <Card key={item.id} bg={bgColor} border="1px" borderColor={borderColor}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack spacing={2}>
                        <Badge colorScheme={getCategoryColor(item.category)} size="sm">
                          {item.category}
                        </Badge>
                        <Badge colorScheme={getPriorityColor(item.priority)} size="sm">
                          {item.priority}
                        </Badge>
                      </HStack>
                      <Heading size="sm">{item.name}</Heading>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {item.description}
                      </Text>
                      <Progress value={item.progress} colorScheme="blue" size="sm" w="full" />
                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color="gray.500">{item.progress}%</Text>
                        <AvatarGroup size="xs" max={2}>
                          {item.assignees.map((assignee, index) => (
                            <Avatar key={index} name={assignee} />
                          ))}
                        </AvatarGroup>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
          </VStack>
        </Box>
      ))}
    </Grid>
  );

  const ListView = () => (
    <Box>
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {roadmapItems.map((item) => (
              <Box key={item.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <Grid templateColumns="2fr 1fr 1fr 1fr 100px" gap={4} alignItems="center">
                  <Box>
                    <HStack spacing={2} mb={1}>
                      <Badge colorScheme={getCategoryColor(item.category)} size="sm">
                        {item.category}
                      </Badge>
                      <Badge colorScheme={getPriorityColor(item.priority)} size="sm">
                        {item.priority}
                      </Badge>
                    </HStack>
                    <Heading size="sm">{item.name}</Heading>
                    <Text fontSize="sm" color="gray.600" noOfLines={1}>
                      {item.description}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" color="gray.500">Timeline</Text>
                    <Text fontSize="sm">
                      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.500">Progress</Text>
                    <HStack>
                      <Progress value={item.progress} colorScheme="blue" size="sm" flex={1} />
                      <Text fontSize="sm">{item.progress}%</Text>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.500">Team</Text>
                    <AvatarGroup size="sm" max={3}>
                      {item.assignees.map((assignee, index) => (
                        <Avatar key={index} name={assignee} />
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Box>
                    <Badge colorScheme={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </Box>
                </Grid>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );

  const RoadmapStats = () => (
    <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel>Total Items</StatLabel>
            <StatNumber>{roadmapItems.length}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12% from last month
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel>In Progress</StatLabel>
            <StatNumber>{roadmapItems.filter(item => item.status === 'In Progress').length}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              3 active items
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel>Completion Rate</StatLabel>
            <StatNumber>
              {Math.round((roadmapItems.filter(item => item.status === 'Completed').length / roadmapItems.length) * 100)}%
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              8% improvement
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel>Avg. Impact Score</StatLabel>
            <StatNumber>
              {(roadmapItems.reduce((sum, item) => sum + item.impact, 0) / roadmapItems.length).toFixed(1)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              High impact focus
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Grid>
  );

  const RoadmapCharts = () => {
    // Prepare data for charts
    const statusData = [
      { name: 'Not Started', value: roadmapItems.filter(item => item.status === 'Not Started').length, color: '#718096' },
      { name: 'In Progress', value: roadmapItems.filter(item => item.status === 'In Progress').length, color: '#3182CE' },
      { name: 'On Hold', value: roadmapItems.filter(item => item.status === 'On Hold').length, color: '#DD6B20' },
      { name: 'Completed', value: roadmapItems.filter(item => item.status === 'Completed').length, color: '#38A169' }
    ];

    const progressData = roadmapItems.map(item => ({
      name: item.name,
      progress: item.progress,
      impact: item.impact,
      effort: item.effort
    }));

    const timelineData = roadmapItems.map(item => ({
      name: item.name,
      startDate: new Date(item.startDate).getMonth() + 1,
      endDate: new Date(item.endDate).getMonth() + 1,
      progress: item.progress,
      status: item.status
    }));

    return (
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={8}>
        {/* Status Distribution Pie Chart */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Status Distribution</Heading>
            <Text fontSize="sm" color="gray.500">Current roadmap item status</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Progress vs Impact Bar Chart */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Progress vs Impact</Heading>
            <Text fontSize="sm" color="gray.500">Feature progress and impact scores</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#3182CE" name="Progress %" />
                <Bar dataKey="impact" fill="#38A169" name="Impact Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Timeline Progress Line Chart */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Timeline Progress</Heading>
            <Text fontSize="sm" color="gray.500">Progress over time</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#3182CE" strokeWidth={2} name="Progress %" />
                <Line type="monotone" dataKey="startDate" stroke="#DD6B20" strokeWidth={1} name="Start Month" />
                <Line type="monotone" dataKey="endDate" stroke="#38A169" strokeWidth={1} name="End Month" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Effort vs Impact Scatter-like Bar Chart */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Effort vs Impact Analysis</Heading>
            <Text fontSize="sm" color="gray.500">Resource allocation efficiency</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="effort" fill="#E53E3E" name="Effort (weeks)" />
                <Bar dataKey="impact" fill="#805AD5" name="Impact Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Grid>
    );
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>ProductHub Roadmap</Heading>
          <Text fontSize="lg" color="gray.600">Plan and track your product development timeline</Text>
        </Box>

        {/* View Controls */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack spacing={4}>
                <Button
                  variant={viewMode === 'timeline' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  onClick={() => setViewMode('timeline')}
                  leftIcon={<FiCalendar />}
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'board' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  onClick={() => setViewMode('board')}
                  leftIcon={<FiBarChart />}
                >
                  Board
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  onClick={() => setViewMode('list')}
                  leftIcon={<FiTarget />}
                >
                  List
                </Button>
              </HStack>
              
              <HStack spacing={4}>
                <Select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  width="150px"
                >
                  <option value="Q1 2024">Q1 2024</option>
                  <option value="Q2 2024">Q2 2024</option>
                  <option value="Q3 2024">Q3 2024</option>
                  <option value="Q4 2024">Q4 2024</option>
                  <option value="Q1 2025">Q1 2025</option>
                  <option value="Q2 2025">Q2 2025</option>
                  <option value="Q3 2025">Q3 2025</option>
                  <option value="Q4 2025">Q4 2025</option>
                </Select>
                
                <Button
                  variant={showCharts ? 'solid' : 'outline'}
                  colorScheme="teal"
                  onClick={() => setShowCharts(!showCharts)}
                  leftIcon={<FiBarChart />}
                >
                  {showCharts ? 'Hide' : 'Show'} Charts
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        <RoadmapStats />
        
        {showCharts && <RoadmapCharts />}

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Tabs index={['timeline', 'board', 'list'].indexOf(viewMode)} onChange={(index) => setViewMode(['timeline', 'board', 'list'][index] as any)}>
              <TabList>
                <Tab>Timeline View</Tab>
                <Tab>Board View</Tab>
                <Tab>List View</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TimelineView />
                </TabPanel>
                <TabPanel>
                  <BoardView />
                </TabPanel>
                <TabPanel>
                  <ListView />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardHeader>
        </Card>
      </VStack>
    </Box>
  );
};

export default RoadmapPage; 