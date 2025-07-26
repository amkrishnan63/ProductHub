import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Progress, VStack, Text, Spinner } from '@chakra-ui/react';
import { getFirestore, collection, getDocs, Timestamp, query, orderBy, where } from 'firebase/firestore';
import { firebaseApp } from '../firebase';

const db = getFirestore(firebaseApp);

const ReportingPage: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const feedbackData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedback(feedbackData);

      // Calculate active users (unique users in last 7 days)
      const now = Timestamp.now().toDate();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const active = new Set(
        feedbackData
          .filter(f => f.createdAt && f.createdAt.toDate && f.createdAt.toDate() >= weekAgo)
          .map(f => f.user)
      );
      setActiveUsers(active.size);
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  // Recent activity: last 5 feedback items
  const recentActivity = feedback.slice(0, 5).map(f =>
    `${f.user} added feedback: "${f.text}" (${f.createdAt && f.createdAt.toDate ? f.createdAt.toDate().toLocaleString() : ''})`
  );

  return (
    <Box p={8}>
      <Heading mb={6}>Reporting & Analytics</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <StatLabel>Feedback Items</StatLabel>
            <StatNumber>{feedback.length}</StatNumber>
            <StatHelpText>total</StatHelpText>
          </Stat>
          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <StatLabel>Active Users</StatLabel>
            <StatNumber>{activeUsers}</StatNumber>
            <StatHelpText>last 7 days</StatHelpText>
          </Stat>
          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <StatLabel>Features Completed</StatLabel>
            <StatNumber>12</StatNumber>
            <StatHelpText>out of 20 (mock)</StatHelpText>
            <Progress mt={2} value={60} colorScheme="teal" />
          </Stat>
        </SimpleGrid>
      )}
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
        <Heading size="md" mb={2}>Recent Activity</Heading>
        <VStack align="start">
          {recentActivity.length === 0 && <Text color="gray.500">No recent activity.</Text>}
          {recentActivity.map((item, idx) => (
            <Text key={idx} color="gray.700">{item}</Text>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default ReportingPage; 