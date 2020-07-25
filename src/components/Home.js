import React, {Component} from 'react';
import {Tabs, Button, Spin, Alert, Row, Col} from 'antd';

import {
    GEO_OPTIONS,
    POS_KEY,
    API_ROOT,
    AUTH_HEADER,
    TOKEN_KEY,
    POST_TYPE_IMAGE,
    POST_TYPE_VIDEO,
    POST_TYPE_UNKNOWN
} from '../constants'
import Gallery from "./Gallery";
import CreatePostButton from "./CreatePostButton";
import AroundMap from "./AroundMap";

const {TabPane} = Tabs;

class Home extends Component {
    state = {
        posts: [],
        err: '',
        isLoadingGeo: false,
        isLoadingPosts: false
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

    renderPosts = (type) => {
        const {posts, err, isLoadingGeo, isLoadingPosts} = this.state;

        // err
        if (err) {
            return err;
        } else if (isLoadingGeo) {
            return <Spin tip="Loading GEO location"/>
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts"/>
        } else if (posts.length > 0) {
            return type === POST_TYPE_IMAGE ? this.renderImagePosts() : this.renderVideoPosts();
            // return <Gallery images={images}/>
        } else {
            return 'No neaby posts';
        }
    }

    renderImagePosts = () => {
        const {posts} = this.state;
        const images = posts.filter(post => post.type === POST_TYPE_IMAGE).map(post => {
            return {
                src: post.url,
                user: post.user,
                thumbnail: post.url,
                thumbnailWidth: 400,
                thumbnailHeight: 300,
                caption: post.message,
            }
        })
        return <Gallery images={images}/>
    }

    renderVideoPosts = () => {
        const {posts} = this.state;
        return <Row gutter={30}>
            {
                posts.filter(post => [POST_TYPE_VIDEO, POST_TYPE_UNKNOWN].includes(post.type)).map(post =>
                    <Col span={6} key={post.url}>
                        <video src={post.url} controls={true} className="video-block"/>
                        <p>{post.user}: {post.message}</p>
                    </Col>
                )
            }
        </Row>
    }

    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Posts" key="1">
                    {this.renderPosts(POST_TYPE_IMAGE)}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.renderPosts(POST_TYPE_VIDEO)}
                </TabPane>
                <TabPane tab="Map" key="3">
                    <AroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{height: `100%`}}/>}
                        containerElement={<div style={{height: `600px`}}/>}
                        mapElement={<div style={{height: `100%`}}/>}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                    />
                </TabPane>
            </Tabs>
        )
    }
}

export default Home;