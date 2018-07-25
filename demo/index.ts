import RelationMap from "../src/RelationMap";
import axios from "axios";

const map = new RelationMap("container");

const query = location.search
const companyName = query.match(/companyName=([a-zA-Z0-9()%]+)/)[1]
const token = query.match(/token=([a-zA-Z0-9.\-_+/]+)/)[1]
const domain = decodeURIComponent(query.match(/domain=([a-zA-Z0-9.%]+)/)[1])

axios({
  method: 'get',
  url: domain + '/beneficialowner/' + companyName,
  headers: {
    token: token,
    smallapp: 'auth'
  }
})
  .then(function(response) {
    // handle success
    console.log(response);
    const data = response.data
    let links = data.result.links;
    const nodes = data.result.nodes;
    links.forEach(link => {
      let lineLabel0 = null;

      if (link.properties.conprop) {
        lineLabel0 =
          (parseFloat(link.properties.conprop) * 100).toFixed(2) + "%";
      }
      if (link.properties.holderrto) {
        lineLabel0 = parseFloat(link.properties.holderrto).toFixed(2) + "%";
      }

      link.lineLabel0 = lineLabel0;

      const lineLabel1 = link.properties.position_desc || null;
      link.lineLabel1 = lineLabel1;
    });

    for (let i = 0; i < links.length; i++) {
      if (links[i].ignore) continue
      for (let j = i + 1; j < links.length; j++) {
        if (links[i].from === links[j].from && links[i].to === links[j].to) {
          if (links[i].lineLabel0 === null) {
            links[i].lineLabel0 = links[j].lineLabel0
          }
          if (links[i].lineLabel1 === null) {
            links[i].lineLabel1 = links[j].lineLabel1
          } else {
            links[i].lineLabel1 += (' ' + links[j].lineLabel1) || ''
          }
          links[j].ignore = true
        }
      }
    }

    links = links.filter(link => {
      return link.ignore !== true
    })

    map.genMap(nodes, links);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .then(function() {
    // always executed
  });
