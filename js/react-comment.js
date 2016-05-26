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
  handleItemHorizontal: function(item, from) {
    var dataLeft = this.state.data;
    var dataRight = this.state.data2;

    if(from === 'left') {
      dataLeft.splice(this.state.data.indexOf(item), 1);
      dataRight.push(item);
    } else {
      dataRight.splice(this.state.data.indexOf(item), 1);
      dataLeft.push(item);
    }
    this.setState({data: dataLeft});
    this.setState({data2: dataRight});
  },
  handleItemVertical: function(idx, from) {
    var tmp;
    var dataRight = this.state.data2;

    if(from === 'up') {
      if(idx === 0)
        return;
      tmp = dataRight[idx - 1];
      dataRight[idx - 1] = dataRight[idx];
      dataRight[idx] = tmp;
    } else {
      if(idx === this.state.data2.length)
        return;
      tmp = dataRight[idx + 1];
      dataRight[idx + 1] = dataRight[idx];
      dataRight[idx] = tmp;
    }

    this.setState({data2: dataRight});
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentLeftList data={this.state.data} onItemClick={this.handleItemHorizontal} />
        <CommentRightList data={this.state.data2} onItemClick={this.handleItemHorizontal} onItemOrder={this.handleItemVertical} />
      </div>
    );
  }
});

var CommentLeftList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, idx) {
      return (
        <Comment key={comment.id} fromSection={'left'} onItemClick={this.props.onItemClick.bind(null, comment, 'left')}>
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

var CommentRightList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, idx) {
      return (
        <Comment key={comment.id} fromSection={'right'} onItemClick={this.props.onItemClick.bind(null, comment, 'right')} onItemUp={this.props.onItemOrder.bind(null, idx, 'up')} onItemDown={this.props.onItemOrder.bind(null, idx, 'down')}>
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
  render: function() {
    if(this.props.fromSection === 'left') {
      return (
        <div className="comment">
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
          <span className="arrow arrow-left" onClick={this.props.onItemClick}/>
        </div>
      )
    } else {
      return (
        <div className="comment">
          <span className="arrow arrow-right" onClick={this.props.onItemClick}/>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
          <span className="arrow arrow-up" onClick={this.props.onItemUp}/>
          <span className="arrow arrow-down" onClick={this.props.onItemDown}/>
        </div>
      )
    }
  }
});

ReactDOM.render(
  <CommentBox url="data.json" pollInterval={5000} />,
  document.getElementById('content')
);
