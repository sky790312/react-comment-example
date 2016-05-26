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
    return {
            data: [],
            data2: []
          };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleItemClick: function() {
    console.log('ininini')
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentList data={this.state.data} onItemClick={this.handleItemClick} />
        <CommentList data={this.state.data2} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  onItemClick: function(idx) {
console.log(idx);
  },
  render: function() {
    var commentNodes = this.props.data.map(function(comment, idx) {
      return (
        <Comment key={comment.id} onItemClick={this.onItemClick(idx)}>
          {comment.text}
        </Comment>
      );
    }, this);
    return (
      <div className="common">
        <div>
          <h1>ISIN</h1>
          <div>
            {commentNodes}
          </div>
        </div>
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  // onItemClick: function() {
  //   this.props.onItemClick();
  // },
  render: function() {
    return (
      <div className="comment">
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <span className="arrow" onClick={this.props.onItemClick}/>
      </div>
    )
  }
});

ReactDOM.render(
  <CommentBox url="data.json" pollInterval={2000} />,
  document.getElementById('content')
);
