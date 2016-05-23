/** @jsx React.DOM */

// Markdown
var converter = new Showdown.converter();

// biggest component, all login putting here
var CommentBox = React.createClass({
  // doing once init data state
  getInitialState: function(){
    return {data: []};
  },
  // doing before render component
  componentWillMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  // get data from server to change data state - setState
  loadCommentsFromServer: function(){
    $.ajax({
      url: this.props.url,
      // dataType: "json",
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error("data.json", status, err.toString());
      }.bind(this)
    });
  },
  // sent request to server update data
  handleCommentSubmit: function(comment){
    // update local view before waitting server
    var comments = this.state.data;
        // newComments = comments.concat({comment});
    comments.push(comment);
    this.setState({data: comments});

    $.ajax({
      url: this.props.url,
      // dataType: "json",
      type: "POST",
      data: comment,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error("data.json", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentLeftList data={this.state.data} />
        <CommentRightList />
        // <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

// var CommentForm = React.createClass({
//   handleSubmit: function(){
//     // refs can get ref value, getDOMNode() can get natvie DOM
//     var author = this.refs.author.getDOMNode().value.trim(),
//         text = this.refs.text.getDOMNode().value.trim();

//     if(!author || !text)
//       return false;

//     // sent request to server, using father onCommentSubmit
//     this.props.onCommentSubmit({author: author, text: text});
//     this.refs.author.getDOMNode().value = this.refs.text.getDOMNode().value = '';

//     return false;
//   },
//   render: function() {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input type="text" placeholder="Your name" ref="author" />
//         <input type="text" placeholder="say something.." ref="text" />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });

var Comment = React.createClass({
  render: function() {
    // Markdown to pure string
    var rawMarkup = converter.makeHtml(this.props.children.toString());

    // dangerouslySetInnerHTML - prevent xss attck - warn not to use
    return (
      <div className="comment">
        <span dangerouslySetInnerHTML = {{__html: rawMarkup}} />
        <span className="arrow" onClick="{this.props.data}" />
      </div>
    );
  }
});

var CommentLeftList = React.createClass({
  render: function() {
    // data.map callback function name as comment to use
    var commentNodes = this.props.data.map(function (comment, index){
      return <Comment key={index}>{comment.text}</Comment>;
    });

    // {} to get and show variable within render function
    return <div className="common commentLeft">
              <div>
                <h1>ISIN</h1>
                <div className="commentLeftList">
                  {commentNodes}
                </div>
              </div>
           </div>;
  }
});

var CommentRightList = React.createClass({
  render: function() {
    return <div className="common commentRight">
              <div>
                <h1>ISIN</h1>
                <div className="commentRightList"></div>
              </div>
           </div>;
  }
});

React.renderComponent(
  // just for practice to use interval - if really want, use secket.io substitute
  <CommentBox url="data.json" pollInterval={10000} />,
  document.getElementById('container')
);