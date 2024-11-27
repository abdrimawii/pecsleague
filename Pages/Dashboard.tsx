import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, TouchableOpacity, Animated, TextInput, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomNavbar from './CustomNavbar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { updateDoc, doc, arrayUnion, increment } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyC43l6Zufh0Pb0HiC37pRHI576lVexcUCs",
  authDomain: "pecsleague.firebaseapp.com",
  databaseURL: "https://pecsleague-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pecsleague",
  storageBucket: "pecsleague.appspot.com",
  messagingSenderId: "130499422560",
  appId: "1:130499422560:android:e12727c32d00788c2a5605",
};
interface Comment {
  username: string;
  comment: string;
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];  
const db = getFirestore(app);

const fetchPosts = async () => {
  try {
    const postsCollection = collection(db, 'posts');
    const snapshot = await getDocs(postsCollection);
    const fetchedPosts = snapshot.docs.map((doc) => {
      const postData = doc.data();
      
      const userEmail =  AsyncStorage.getItem('userEmail');

      
      const liked = postData.usersLiked && postData.usersLiked.includes(userEmail);
      return {
        id: doc.id,
        ...postData,
        liked,  
      };
    });
    console.log('Fetched Posts:', fetchedPosts);
    return fetchedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
const News: React.FC<any> = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(null);
    const [notificationCount, setNotificationCount] = useState(4); 
    const [postss, setPosts] = useState<any[]>([]); 

      
  const [commentsVisibility, setCommentsVisibility] = useState<any>({});
  const [newComment, setNewComment] = useState('');

  const [waveAnimation, setWaveAnimation] = useState(new Animated.Value(0));
  const [isModalVisible, setModalVisible] = useState(false);
 
  const handleNotificationPress = () => {
    console.log("Notification icon pressed!");  
    setModalVisible(true);  
  };
  useEffect(() => {
    
    const wave = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    wave(); 

    
  }, []);
  
  const waveInterpolate = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'], 
  });
  
  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchPosts(); 
      setPosts(fetchedPosts || []); 
    };
    loadPosts();
  }, []);

  const toggleComments = (postId: number) => {
    setCommentsVisibility((prevState: any) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleLike = async (postId: string) => {
    
    const userDetailsString = await AsyncStorage.getItem('userDetails');
    
    
    const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
    
    if (!userDetails || !userDetails.email) {
      console.log('User is not logged in');
      return;
    }
  
    const userEmail = userDetails.email; 
  
  
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id.toString() === postId) {
          const isLiked = post.usersLiked && post.usersLiked.includes(userEmail);
  
          if (isLiked) {
            return post;
          }
  
          const updatedLikesCount = (post.likesCount || 0) + 1;  
          const updatedPost = {
            ...post,
            liked: true,
            likesCount: updatedLikesCount,
            usersLiked: [...(post.usersLiked || []), userEmail], 
          };
  
          const postRef = doc(db, 'posts', postId);
          updateDoc(postRef, {
            likesCount: updatedLikesCount,
            usersLiked: arrayUnion(userEmail),
          })
            .then(() => {
            })
            .catch((error) => {
            });
  
          return updatedPost;
        }
        return post;
      })
    );
  };
  const handleAddComment = async (postId: string) => {
    if (newComment.trim()) {
      const userDetailsString = await AsyncStorage.getItem('userDetails');
      const userDetails = JSON.parse(userDetailsString || '{}');
      const userName = userDetails.firstName && userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : 'Anonymous User';
  
      console.log(`Adding comment to postId: ${postId}`);
  
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id.toString() === postId) {
            const updatedComments = [
              ...post.comments,
              { username: userName, comment: newComment },
            ];
  
            const updatedCommentsCount = post.commentsCount + 1;
  
            const updatedPost = {
              ...post,
              comments: updatedComments,
              commentsCount: updatedCommentsCount,
            };
  
            const postRef = doc(db, 'posts', postId);
            updateDoc(postRef, {
              comments: arrayUnion({ username: userName, comment: newComment }),
              commentsCount: increment(1),
            }).catch((error) => console.error('Error adding comment:', error));
  
            return updatedPost;
          }
          return post;
        })
      );
  
      setNewComment(''); 
      console.log("Comment input cleared");
    }
  };
  

  useEffect(() => {
    
    const loadUserDetails = async () => {
      const userDetailsString = await AsyncStorage.getItem('userDetails');
      const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
      if (userDetails && userDetails.email) {
        setUserEmail(userDetails.email);
      }
    };

    loadUserDetails();
  }, []); 

  if (!userEmail) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.topBox}>
        <Animated.Image
          source={require('../assets/images/news.png')}
          style={[styles.vector, { transform: [{ rotate: waveInterpolate }] }]}
          resizeMode="contain"
        />
        <Image
        source={require('../assets/images/backgrounddots.png')}
        style={styles.backgroundDots}
        resizeMode="cover"
      />
      </View>
      
      

      <Text style={styles.title}>Home</Text>
      <CustomNavbar navigation={navigation} />

      <ScrollView
  style={styles.newsFeedContainer}
  contentContainerStyle={{
    paddingBottom: postss.length > 0 ? 100 : 0,  
  }}
>
      {postss.map((post) => (
  <View key={post.id} style={styles.postCard}>
    <View style={styles.postHeader}>
      <Image source={require('./sample/profile1.png')} style={styles.profileImage} />
      <Text style={styles.userName}>{post.postedBy}</Text>
    </View>
    <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
    <Text style={styles.caption}>{post.headerText}</Text>
    <Text style={styles.postDescription}>{post.subHeader}</Text>
    <View style={styles.interactionContainer}>
    <TouchableOpacity
  style={[
    styles.interactionButton,
    post.usersLiked && post.usersLiked.includes(userEmail) 
      ? { backgroundColor: '#9f00ff' } 
      : {}, 
  ]}
  onPress={() => handleLike(post.id)}
>
  <Image
    source={require('./sample/like.png')}
    style={[
      styles.interactionIcon,
      post.usersLiked && post.usersLiked.includes(userEmail) 
        ? { tintColor: '#fff' } 
        : {}, 
    ]}
  />
  <Text
    style={[
      styles.likeText,
      post.usersLiked && post.usersLiked.includes(userEmail) 
        ? { color: '#fff' } 
        : {}, 
    ]}
  >
    {post.likesCount} Likes
  </Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.interactionButton} onPress={() => toggleComments(post.id.toString())}>
        <Image source={require('./sample/comment.png')} style={styles.interactionIcon} />
        <Text style={styles.likeText}>{post.comments.length} Comments</Text>
      </TouchableOpacity>
    </View>

    {commentsVisibility[post.id] && (
      <View style={styles.commentsSection}>
        {post.comments.map((comment: Comment, index: number) => (
          <View key={index} style={styles.comment}>
            <Text style={styles.commentText}>
              <Text style={styles.commentUserName}>{comment.username}</Text>{' '}
              {comment.comment}
            </Text>
          </View>
        ))}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment for this post"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleAddComment(post.id)}
          >
            <Image
              source={require('../assets/images/send.png')}
              style={styles.submitButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
))}
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  newsFeedContainer: {
    marginTop: 17,
    paddingHorizontal: 15,
  },
  topBox: {
    width: '100%',
    height: 120, 
    backgroundColor: '#9f00ff',
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden', 
  },
  title: {
    position: 'absolute',
    fontSize: 32,
    textAlign: 'left',
    top: '6%',
    left: 20,
    padding: 10,
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
  },
  vector: {
    position: 'absolute',
    top: '10%',
    width: '130%',
    height: '130%',
    opacity: 0.2,
    left: '10%',
  },
  notificationIconContainer: {
    position: 'absolute',
    top:'7.5%', 
    right: 25, 
    zIndex: 10, 
  },
  notificationIcon: {
    width: 32,  
    height: 32, 
    tintColor: '#fff', 
  },
   notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',  
    width: 20,
    height: 20,
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, 
  },
  notificationCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,  
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    paddingBottom: 0,
    marginTop:5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 45,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 280,
  },
  caption: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    padding: 15,
    marginTop: 10,
  },
  postDescription: {
    fontSize: 16,
    color: '#777',
    lineHeight: 22,
    paddingHorizontal: 15,
    paddingBottom: 15,
    fontStyle: 'italic',
  },
  interactionContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 15,
  },
  interactionIcon: {
    width: 24,
    height: 24,
    tintColor: '#888',
    marginRight: 5,
  },
  likeText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
    borderRadius: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#777',
    
  },
  commentUserName: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    flex: 1,
    paddingLeft: 15,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    padding: 10,
  },
  submitButtonIcon: {
    width: 30,
    height: 30,
    tintColor: '#9f00ff',
    
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',  
  },
  
  modalContainer: {
    width: '85%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
  },

  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#9f00ff',  
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  
  },

  closeButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff', 
  },
  backgroundDots:{
    opacity:0.15,
    tintColor:'#fff',
    width:500,
    height:300,
    right:10,
  }

});

export default News;