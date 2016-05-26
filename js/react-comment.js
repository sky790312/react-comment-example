var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentLeftList data={this.state.data} />
        <CommentRightList />
      </div>
    );
  }
});

var CommentLeftList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="common commentLeft">
        <div>
          <h1>ISIN</h1>
          <div className="commentLeftList">
            {commentNodes}
          </div>
        </div>
      </div>
    );
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

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },


  render: function() {
    return (
      <div className="comment">
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <span className="arrow" />
      </div>
    )
  }
});

ReactDOM.render(
  <CommentBox url="data.json" pollInterval={2000} />,
  document.getElementById('content')
);
