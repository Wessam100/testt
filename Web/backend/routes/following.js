const express = require('express');
const router = express.Router();
const {getAllFollowing,followUser,unfollowUser,getFollowerCount,getAllFollowers} = require('../controllers/followingController');

router.get('/:username/following', getAllFollowing);


router.get('/:username/followers', getAllFollowers);

router.get('/:username/count', getFollowerCount);

router.post('/:username/follow', followUser);


router.delete('/:username/unfollow/:targetUsername', unfollowUser);

module.exports = router; 