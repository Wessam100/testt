const { Following, User } = require('../models');

const getAllFollowing = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const following = await Following.findAll({
            where: { followerId: user.id },
            include: [{
                model: User,
                as: 'followed',
                attributes: ['username', 'profilePicture', 'isAuthor']
            }]
        });

        res.json(following.map(f => f.followed));
    } catch (error) {
        console.error('Error in getAllFollowing:', error);
        res.status(500).json({ error: error.message });
    }
};

const followUser = async (req, res) => {
    try {
        const { username } = req.params;
        const { targetUsername } = req.body;
        
        const [follower, target] = await Promise.all([
            User.findOne({ where: { username } }),
            User.findOne({ where: { username: targetUsername } })
        ]);

        if (!follower || !target) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followRecord = await Following.findOne({where: {followerId: follower.id,followedId: target.id}});
        if (followRecord) {
            return res.status(209).json({ info : 'record exists' });
        }
        await Following.create({
            followerId: follower.id,
            followedId: target.id
        });

        res.status(201).json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error('Error in followUser:', error);
        res.status(500).json({ error: error.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { username, targetUsername } = req.params;
        
        const [follower, target] = await Promise.all([
            User.findOne({ where: { username } }),
            User.findOne({ where: { username: targetUsername } })
        ]);

        if (!follower || !target) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Following.destroy({
            where: {
                followerId: follower.id,
                followedId: target.id
            }
        });

        res.status(200).json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        console.error('Error in unfollowUser:', error);
        res.status(500).json({ error: error.message });
    }
};

const getFollowerCount = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const count = await Following.count({
            where: { followedId: user.id }
        });

        res.json({ count });
    } catch (error) {
        console.error('Error in getFollowerCount:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllFollowers = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followers = await Following.findAll({
            where: { followedId: user.id },
            include: [{
                model: User,
                as: 'follower',
                attributes: ['username', 'profilePicture', 'isAuthor']
            }]
        });

        res.json(followers.map(f => f.follower));
    } catch (error) {
        console.error('Error in getAllFollowers:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { unfollowUser, getFollowerCount, getAllFollowers , followUser, getAllFollowing};
