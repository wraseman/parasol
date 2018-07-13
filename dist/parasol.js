
// NOTE: somehow require d3, parcoords, underscore, ...

// ----------
// template
// ----------
// function description
// var fname = function fname(global vars) {
//   return function (local vars) {
//     do stuff
//   };
// };

// ----------
// api
// ----------
// ParaVis(data, objectives) // create a dual plot variable
//
// // extensions for ParaVis and ParCoords type vars
// .grid()
// .linked([plot_list])
// .link_reset(brushes, marks, all)
// .cluster(k=3, group="both", color_palette)
// .aggregate({weights})
// .hide([axes_list])
// .show([axes_list])
// .utopia_line([optimize_list])
// //.uncertainty_mode(1,2,3,4)
//
// keep_selected(selection = (brushed, marked, both))
// remove_selected(selection = (brushed, marked, both))
// load_file(file)
// load_data(data, objectives, grid=false)
// export_selected(selection = (brushed, marked, both), filename)
// save_image(plot)
//
// ----------
// internal functions
// ----------
// convert_to_float(x)
// parcoords_format(data)
// build_grid(userConfig, data, plot_list)
// grid_update(dataView, data, plot_list)



// constructor:
// initializes two independent ParCoords vars and retuns them in an array
var ParaVis = function ParaVis(dataset, partition, n) {
  // dataset: may be either an object or an array, all values should be the same format
  // partition: object indicating which plots a variable should be included in; formatted as partition = { "var": [pids] }
  // n: number of plots to create
  console.log(partition);

  // setup array of arrays to store hidden axes for all plots
  var hidden = Array.from({length: n}, (pid) => []);

  // update hidden variables based on partition
  Object.entries(partition).forEach(
    ([axis, pids]) => {
      // identify pids in which an axis should be hidden
      var hidden_pids = _.difference(_.range(n), pids);
      // append axis name to hidden[pid] array
      hidden_pids.forEach(
        (pid) => { hidden[pid].push(axis) }
      )
    }
  );

  // hide axis from all plots if not found in partition
  var extraneous_vars = _.difference(Object.keys(dataset[0]), Object.keys(partition));
  hidden.forEach(
    (hidden_pid) => {
      hidden_pid.push(extraneous_vars)
    })
  console.log(hidden);

  // store pc plots in array
  var plots = [];
  d3.selectAll(".parcoords")
    .each(function(d,pid) {
        plots[pid] = ParCoords()(this)
          .data(dataset)
          .hideAxis(hidden[pid])
          .alpha(0.4)
          .alphaOnBrushed(0.1)
          .render()
          .reorderable()
          .mode("queue")
          .brushMode("1D-axes");
    });
  console.log(plots);

  return(plots);
}
