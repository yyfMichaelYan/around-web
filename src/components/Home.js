import React, {Component} from 'react';
import {Tabs, Button, Spin, Alert} from 'antd';

import {GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY} from '../constants'

import Gallery from "./Gallery";

const {TabPane} = Tabs;

class Home extends Component {
    state = {
        posts: [],
        err: '',
        isLoadingGeo: false,
        isLoadingPosts: false
    }

    render() {
        const operations = <Button type="primary">Create New Post</Button>;

        return (
            <Tabs tabBarExtraContent={operations}>
                <TabPane tab="Image Posts" key="1">
                    {
                        this.renderImagePosts()
                    }
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    Content of tab 2
                </TabPane>
                <TabPane tab="Map" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        );
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({
                isLoadingGeo: true
            })
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            )
        } else {
            this.setState({
                err: 'fetch geo-location failed'
            })
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position)
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}))
        this.setState({
            isLoadingGeo: false,
            err: ''
        })
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        console.log('err in location fetching')
        this.setState({
            err: 'location failed'
        })
    }

    loadNearbyPosts = () => {
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);

        this.setState({
            isLoadingPosts: true
        })

        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            method: "GET",
            headers: {Authorization: `${AUTH_HEADER} ${token}`}
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("fetch nearby posts failed")
        }).then(data => {
            console.log(data)
            this.setState({
                posts: data ? data : [],
                isLoadingPosts: false
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                err: 'fetch posts failed'
            })
        })
    }

    renderImagePosts = () => {
        const {posts, err, isLoadingGeo, isLoadingPosts} = this.state;

        // err
        if (err) {
            return err;
        } else if (isLoadingGeo) {
            return <Spin tip="Loading GEO location"/>
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts"/>
        } else if (posts.length > 0) {
            const images = posts.map(post => {
                return {
                    src: post.url,
                    user: post.user,
                    thumbnail: post.url,
                    thumbnailWidth: 300,
                    thumbnailHeight: 400,
                    caption: post.message,
                }
            })
            return <Gallery images={images}/>
        } else {
            return 'No neaby posts';
        }
    }
}

export default Home;