import React, { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Tag, Button, Input, HStack, Text, Spinner } from '@chakra-ui/react';
import { getFirestore, collection, addDoc, getDocs, Timestamp, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase';
import { useAuth } from '../auth/AuthContext';

const db = getFirestore(firebaseApp);

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch feedback from Firestore
  const fetchFeedback = async () => {
    setLoading(true);
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    setFeedback(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line
  }, []);

  // Add new feedback to Firestore
  const handleAddFeedback = async () => {
    if (newFeedback.trim()) {
      await addDoc(collection(db, 'feedback'), {
        text: newFeedback,
        upvotes: 0,
        upvoters: [],
        tags: [],
        feature: 'Unlinked',
        createdAt: Timestamp.now(),
        user: user?.username || user?.email || 'Anonymous',
      });
      setNewFeedback('');
      await fetchFeedback();
    }
  };

  // Toggle upvote/unupvote, and prevent creator from upvoting
  const handleUpvote = async (id: string) => {
    if (!user) return;
    const feedbackRef = doc(db, 'feedback', id);
    const feedbackSnap = await getDoc(feedbackRef);
    const data = feedbackSnap.data();
    if (!data) return;
    const upvoters = data.upvoters || [];
    const userId = user.username || user.email;
    if (data.user === userId) return; // Creator cannot upvote
    if (upvoters.includes(userId)) {
      // Unupvote
      await updateDoc(feedbackRef, {
        upvotes: Math.max((data.upvotes || 1) - 1, 0),
        upvoters: arrayRemove(userId),
      });
    } else {
      // Upvote
      await updateDoc(feedbackRef, {
        upvotes: (data.upvotes || 0) + 1,
        upvoters: arrayUnion(userId),
      });
    }
    await fetchFeedback();
  };

  // Delete feedback (only for creator)
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'feedback', id));
    await fetchFeedback();
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Customer Feedback Inbox</Heading>
      <HStack mb={4}>
        <Input
          placeholder="Add new feedback..."
          value={newFeedback}
          onChange={e => setNewFeedback(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleAddFeedback}>Submit</Button>
      </HStack>
      {loading ? (
        <Spinner />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Feedback</Th>
              <Th>Upvotes</Th>
              <Th>Tags</Th>
              <Th>Linked Feature</Th>
              <Th>User</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {feedback.map(f => {
              const userId = user?.username || user?.email;
              const isCreator = f.user === userId;
              const hasUpvoted = (f.upvoters || []).includes(userId);
              return (
                <Tr key={f.id}>
                  <Td>{f.text}</Td>
                  <Td>{f.upvotes}</Td>
                  <Td>{f.tags && f.tags.map((tag: string) => <Tag key={tag} mr={1}>{tag}</Tag>)}</Td>
                  <Td>{f.feature}</Td>
                  <Td>{f.user}</Td>
                  <Td>
                    <Button
                      size="sm"
                      onClick={() => handleUpvote(f.id)}
                      disabled={!user || isCreator}
                      colorScheme={hasUpvoted ? 'teal' : 'gray'}
                      variant={hasUpvoted ? 'solid' : 'outline'}
                      mr={2}
                    >
                      {hasUpvoted ? 'Unupvote' : 'Upvote'}
                    </Button>
                    {isCreator && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(f.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
      <Box mt={8}>
        <Heading size="md" mb={2}>Insights Board</Heading>
        <Text color="gray.600">(Example) "Performance" is the most common tag. Users want faster mobile experience.</Text>
      </Box>
    </Box>
  );
};

export default FeedbackPage; 