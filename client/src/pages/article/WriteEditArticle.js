import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../../components/Loading";
import { IoCameraSharp } from "react-icons/io5";
import { AddArticle,GetArticle,UpdateArticle,UploadArticlePicture } from "../../state/actions/articleActions";
import { Button, Col, Container } from "react-bootstrap";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { slugGenerator } from "../../utils/functions";
import { IMAGES_URL } from "../../config/constants";

class WriteEditArticle extends Component {
    state = {file: null,id: "", title: "", content: "", thumbnail: "https://i.stack.imgur.com/y9DpT.jpg"}
    handleSubmit = async (e) => {
        const { file, title, content, thumbnail} = this.state;
        e.preventDefault();
        
        if (file && this.state.id === "") {
            const data = new FormData();
            const filename =  Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            this.props.addArticle(data, {title: title, slug: slugGenerator(title), thumbnail: file ? filename : thumbnail, content: content})
        }
        else if (this.state.id !== "") {
            this.props.updateArticle({id: this.state.id, title: title, content: content})
        }
        else {
            toast.error("Please Upload Thumbnail");
        }
        
    };

    componentDidMount() {
        if (this.props.match.params.slug) {
            this.props.getArticle(this.props.match.params.slug, true);
          }
    }

    componentDidUpdate(previousProps) {
        if (previousProps.article.article !== this.props.article.article && this.props.article.article !== null) {
            this.setState({
                id: this.props.article.article._id,
                title: this.props.article.article.title,
                content: this.props.article.article.content,
                thumbnail: this.props.article.article.thumbnail
            })
        }
    }


    render() {
        const {  isLoading } = this.props.article;
        return (
            <div>
                <Header />
                <Container>
                    {isLoading === true ? (
                        <Col className="newsLoadingDiv">
                            <Loading />
                        </Col>
                    ) : (
                        <div className="write">
            
                                <img className="writeImg imageCurve" src={ this.state.file !== null ? URL.createObjectURL(this.state.file): this.state.id === ""? this.state.thumbnail: IMAGES_URL+this.state.thumbnail} alt="" />
            
                            <form className="writeForm" onSubmit={this.handleSubmit}>
                                    <div className="writeFormGroup">
                                        {this.state.id === "" && <span>
                                            <label htmlFor="fileInput">
                                        
                                                <IoCameraSharp />
                                            </label>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                style={{ display: "none" }}
                                                onChange={(e) => this.setState({ file: (e.target.files[0]) })}
                                            />
                                        </span>}
                                    <input
                                            type="text"
                                            value={this.state.title}
                                        placeholder="Title"
                                        className="writeInput"
                                        autoFocus={true}
                                        onChange={(value) => {
                                            this.setState({
                                                title: value.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="writeFormGroup">
                                    <textarea
                                        placeholder="Tell your story..."
                                            type="text"
                                            value={this.state.content}
                                        className="writeInput writeText"
                                        onChange={(value) => {
                                            this.setState({
                                                content: value.target.value,
                                            });
                                        }}
                                    ></textarea>
                                </div>
                                    <Button
                                         className="writeSubmit"
                                    variant="primary"
                                    type="submit"
                                    >
                                        {this.state.id ===  "" ? "Publish" : "Update"}
                                    
                                </Button>
                            </form>
                        </div>)}
                    </Container>
        </div>
                );
    }
}

const mapStateToProps = (state) => {
    return {
        article: state.article,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addArticle: (picture, article) => dispatch(AddArticle(picture, article)),
        updateArticle: (article) => dispatch(UpdateArticle(article)),
        getArticle: (slug, edit) => dispatch(GetArticle(slug, edit)),
        uploadArticlePicture: (file) => dispatch(UploadArticlePicture(file))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteEditArticle);

// import { useContext, useState } from "react";
// import "./write.css";
// import axios from "axios";
// import { Context } from "../../context/Context";

// export default function WriteArticle() {
//     const [title, setTitle] = useState("");
//     const [desc, setDesc] = useState("");
//     const [file, setFile] = useState(null);
//     const { user } = useContext(Context);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const newPost = {
//             username: user.username,
//             title,
//             desc,
//         };
//         if (file) {
//             const data = new FormData();
//             const filename = Date.now() + file.name;
//             data.append("name", filename);
//             data.append("file", file);
//             newPost.photo = filename;
//             try {
//                 await axios.post("/upload", data);
//             } catch (err) { }
//         }
//         try {
//             const res = await axios.post("/posts", newPost);
//             window.location.replace("/post/" + res.data._id);
//         } catch (err) { }
//     };
//     return (
        
//     );
// }