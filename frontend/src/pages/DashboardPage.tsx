import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  Card, 
  CardBody, 
  CardHeader,
  Badge,
  Progress,
  HStack,
  VStack,
  Avatar,
  AvatarGroup,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiTrendingUp, 
  FiTarget,
  FiClock,
  FiStar,
  FiActivity,
  FiBarChart
} from 'react-icons/fi';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

const db = getFirestore(firebaseApp);

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalFeedback: 0,
    activeFeatures: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topFeatures, setTopFeatures] = useState<any[]>([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch feedback count
      const feedbackSnapshot = await getDocs(collection(db, 'feedback'));
      const feedbackCount = feedbackSnapshot.size;

      // Fetch recent activity (last 5 feedback items)
      const recentQuery = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(5));
      const recentSnapshot = await getDocs(recentQuery);
      const recent = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setMetrics({
        totalUsers: 24,
        totalFeedback: feedbackCount,
        activeFeatures: 12,
        completionRate: 78
      });

      setRecentActivity(recent);
      setTopFeatures([
        { name: 'Mobile App Redesign', impact: 9, effort: 7, status: 'In Progress' },
        { name: 'Dark Mode Support', impact: 8, effort: 4, status: 'Planned' },
        { name: 'Advanced Analytics', impact: 7, effort: 9, status: 'Backlog' },
        { name: 'API Integration', impact: 6, effort: 5, status: 'Completed' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data
      setMetrics({
        totalUsers: 24,
        totalFeedback: 15,
        activeFeatures: 12,
        completionRate: 78
      });
      setRecentActivity([
        { user: 'John Doe', text: 'The mobile app needs better performance', upvotes: 5 },
        { user: 'Jane Smith', text: 'Dark mode would be great for night usage', upvotes: 8 },
        { user: 'Mike Johnson', text: 'Analytics dashboard is very useful', upvotes: 3 }
      ]);
      setTopFeatures([
        { name: 'Mobile App Redesign', impact: 9, effort: 7, status: 'In Progress' },
        { name: 'Dark Mode Support', impact: 8, effort: 4, status: 'Planned' },
        { name: 'Advanced Analytics', impact: 7, effort: 9, status: 'Backlog' },
        { name: 'API Integration', impact: 6, effort: 5, status: 'Completed' }
      ]);
    }
  };

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <Flex align="center" justify="space-between">
          <Box>
            <Stat>
              <StatLabel color="gray.500" fontSize="sm">{title}</StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
              {change && (
                <StatHelpText>
                  <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(change)}%
                </StatHelpText>
              )}
            </Stat>
          </Box>
          <Icon as={icon} boxSize={8} color={`${color}.500`} />
        </Flex>
      </CardBody>
    </Card>
  );

  const PriorityMatrix = () => (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Feature Prioritization Matrix</Heading>
        <Text fontSize="sm" color="gray.500">Impact vs Effort Analysis</Text>
      </CardHeader>
      <CardBody>
        <Box position="relative" h="300px" bg="gray.50" borderRadius="md" p={4}>
          {/* Grid lines */}
          <Box position="absolute" top="50%" left="0" right="0" h="1px" bg="gray.300" />
          <Box position="absolute" left="50%" top="0" bottom="0" w="1px" bg="gray.300" />
          
          {/* Labels */}
          <Text position="absolute" top="2" left="2" fontSize="xs" fontWeight="bold">High Impact</Text>
          <Text position="absolute" bottom="2" left="2" fontSize="xs" fontWeight="bold">Low Impact</Text>
          <Text position="absolute" left="2" top="50%" transform="rotate(-90deg) translateX(50%)" fontSize="xs" fontWeight="bold">Low Effort</Text>
          <Text position="absolute" right="2" top="50%" transform="rotate(90deg) translateX(50%)" fontSize="xs" fontWeight="bold">High Effort</Text>

          {/* Feature dots */}
          {topFeatures.map((feature, index) => (
            <Box
              key={index}
              position="absolute"
              left={`${(feature.effort / 10) * 80}%`}
              top={`${100 - (feature.impact / 10) * 80}%`}
              w="12px"
              h="12px"
              bg={feature.status === 'In Progress' ? 'blue.500' : 
                  feature.status === 'Planned' ? 'green.500' : 
                  feature.status === 'Completed' ? 'gray.500' : 'orange.500'}
              borderRadius="full"
              transform="translate(-50%, -50%)"
              cursor="pointer"
              _hover={{ transform: 'translate(-50%, -50%) scale(1.2)' }}
              title={`${feature.name} (Impact: ${feature.impact}, Effort: ${feature.effort})`}
            />
          ))}
        </Box>
      </CardBody>
    </Card>
  );

  const CustomerInsights = () => (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Customer Insights</Heading>
        <Text fontSize="sm" color="gray.500">Top feedback themes</Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm">Performance</Text>
              <Text fontSize="sm" fontWeight="bold">45%</Text>
            </Flex>
            <Progress value={45} colorScheme="blue" size="sm" />
          </Box>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm">User Experience</Text>
              <Text fontSize="sm" fontWeight="bold">32%</Text>
            </Flex>
            <Progress value={32} colorScheme="green" size="sm" />
          </Box>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm">Feature Requests</Text>
              <Text fontSize="sm" fontWeight="bold">23%</Text>
            </Flex>
            <Progress value={23} colorScheme="orange" size="sm" />
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );

  const RecentActivity = () => (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Recent Activity</Heading>
        <Text fontSize="sm" color="gray.500">Latest feedback and updates</Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          {recentActivity.slice(0, 5).map((activity, index) => (
            <Box key={index} p={3} bg="gray.50" borderRadius="md">
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={activity.user} />
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium">{activity.user}</Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={2}>{activity.text}</Text>
                </Box>
                <Badge colorScheme="blue" fontSize="xs">
                  {activity.upvotes || 0} votes
                </Badge>
              </Flex>
            </Box>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );

  const TeamCollaboration = () => (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Team Collaboration</Heading>
        <Text fontSize="sm" color="gray.500">Active team members</Text>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <AvatarGroup size="md" max={6}>
            <Avatar name="John Doe" src="https://bit.ly/john-doe" />
            <Avatar name="Jane Smith" src="https://bit.ly/jane-smith" />
            <Avatar name="Mike Johnson" src="https://bit.ly/mike-johnson" />
            <Avatar name="Sarah Wilson" src="https://bit.ly/sarah-wilson" />
          </AvatarGroup>
          <Text fontSize="sm" color="gray.500">4 team members active today</Text>
          <Button size="sm" colorScheme="blue" variant="outline">
            View Team
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>ProductHub Dashboard</Heading>
          <Text fontSize="lg" color="gray.600">Welcome to your product management workspace</Text>
        </Box>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard 
            title="Total Users" 
            value={metrics.totalUsers} 
            change={12} 
            icon={FiUsers} 
            color="blue" 
          />
          <StatCard 
            title="Feedback Items" 
            value={metrics.totalFeedback} 
            change={8} 
            icon={FiMessageSquare} 
            color="green" 
          />
          <StatCard 
            title="Active Features" 
            value={metrics.activeFeatures} 
            change={-3} 
            icon={FiTarget} 
            color="orange" 
          />
          <StatCard 
            title="Completion Rate" 
            value={`${metrics.completionRate}%`} 
            change={5} 
            icon={FiTrendingUp} 
            color="purple" 
          />
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <PriorityMatrix />
              <CustomerInsights />
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack spacing={6} align="stretch">
              <RecentActivity />
              <TeamCollaboration />
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default DashboardPage; 