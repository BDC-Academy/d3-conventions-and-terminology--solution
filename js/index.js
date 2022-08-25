// In the lifetime of D3.js some terminology and conventions are used to make life easier (or maybe more complex).
// These conventions are also often used in examples and things like stack exchange, but can be confusing if you're not familiar with them.
// That is why we will take a moment to look at the most common and important ones before we dive further into creating charts with D3. 

/**
 * We've used accessor function in previous repositories to access certain properties of data
 * and sometimes do calculations with them.
 * D3 accessor functions make it possible to dynamically set properties and attributes on elements in a D3 selection.
 * Accessor function can be anonymous/inline but may also be extrapolated and re-used in different selections.
 * Accessor functions ussually accept three arguments that may or may not be used: d(atum), i(ndex) and nodes (array of elements in the selection)
 * You can of course add arguments if you need them
 */
function accessorFunctions() {
  // TODO: 2.1 Create a couple of accessor functions based on the dataset found at the end of this file, that we can use later on
  // - define an accessor function 'valueAccessor' that returns the 'income' of d (as a number)
  // - define an accessor function 'formattedValueAccessor' that returns the formatted value of income. Tip: use d3.format('$,.0f')(d.income) to achieve this quickly.
  // - define an accessor function 'categoryAccessor' that returns the 'customer' of d
  // - define an accessor function 'serieAccessor' that returns the 'month' of d
  // - define an accessor function 'xAccessor' that calculates the x position of a column by multiplying 20 and i
  // - define an accessor function 'widthAccessor' that returns a fixed value of 18 (no calculations)
  // - define an accessor function 'heightAccessor' that calculates the height of a column with --> height / maxIncome * d.income. You will also need to receive parameters 'height' and 'maxIncome'.
  // - define an accessor function 'yAccessor' that calculates the y position of a column with --> height - (height / maxIncome * d.income). You will also need to receive parameters 'height' and 'maxIncome'.
  // Note: see if you understand why height and y are calculated that way.

  const valueAccessor = (d, i, nodes) => d.income;
  const formattedValueAccessor = (d, i, nodes) => d3.format('$,.0f')(d.income);
  const categoryAccessor = (d, i, nodes) => d.customer;
  const serieAccessor = (d, i, nodes) => d.month;
  const xAccessor = (d, i, nodes) => 20 * i;
  const widthAccessor = (d, i, nodes) => 18;
  const heightAccessor = (d, i, nodes, height, maxIncome) => height / maxIncome * d.income;
  const yAccessor = (d, i, nodes, height, maxIncome) => height - (height / maxIncome * d.income);

  // - define an accessor function 'colorAccessor' that returns a color based on the month (serie) of d. You may assume that d is the actual month.
  // Return 
  //  - 'blue' when month is 'Sep-16'
  //  - 'orange' when month is 'Dec-16'
  //  - 'gray' when month is 'Mar-17'
  //  - 'yellow' when month is 'Jun-17'
  const colorAccessor = (d, i, nodes) => ({ 'Sep-16': 'blue', 'Dec-16': 'orange', 'Mar-17': 'gray', 'Jun-17': 'yellow' }[d]);


  // Note: besides accessor functions D3 also uses 'comparator functions' a lot --> (a, b) => a < b ? -1 : 1
  // comparators work the same as in JavaScript for example in Array.sort: return negative number if a, positive number if b and if they are the same 0.


  // TODO: 2.2 To make our accessor functions available to the other assigments in this file, return the below object
  return {
    valueAccessor, formattedValueAccessor,
    categoryAccessor, serieAccessor, xAccessor,
    widthAccessor, heightAccessor, yAccessor, colorAccessor
  };
}

/**
 * D3 provides a lot of convenient utils to transform, calculate and format data.
 * the most commonly used: 
 * - statistics: d3.max, d3.min, d3.extent
 * - search: d3.least, d3.greatest, d3.ascending, d3.descending
 * - transformations: d3.groups, d3.ticks, d3.nice, d3.range
 * - iterables: d3.sort
 * - sets: d3.difference, d3.union, d3.intersection
 * - formatting: d3.format
 * Let's try all of these out using our dataset
 */
function dataManipulationUtils() {
  // re-use the accessor functions
  const {
    valueAccessor, formattedValueAccessor,
    categoryAccessor, serieAccessor, xAccessor,
    widthAccessor, heightAccessor, yAccessor, colorAccessor
  } = accessorFunctions();

  // TODO: 2.1 Use d3.max, d3.min and d3.extent to get the extremes from the data.
  // D3.min and d3.max return the minimum or maximum value, using an optional accessor function.
  // D3.extent returns both the min and max.
  // - use D3.min and D3.max to get the minimum and maximum 'income' from the dataset using the valueAccessor
  // - use D3.extent to find the minimum and maximum 'month' from the dataset. What do you think the result will be?
  // - inspect the results in the browser debugging tools
  const min = d3.min(dataset, valueAccessor);
  const max = d3.max(dataset, valueAccessor);
  const extent = d3.extent(dataset, serieAccessor);

  // TODO: 2.2 Use d3.least and d3.greatest with to get the actual object that contains the extremes
  // D3.least and D3.greatest do about the same as min and max but return the object and CAN use a comparator instead of a accessor.
  // - use d3.least to find the object that has the smallest income. Use a custom comparator instead of an accessor.
  // - use d3.greatest to find the object that has the greatest income. Use a custom comparator instead of an accessor.
  // - inspect the result in the browser debugging tools
  const least = d3.least(dataset, (a, b) => a.income - b.income);
  const greatest = d3.greatest(dataset, (a, b) => a.income - b.income);

  // TODO: 2.3 use d3.sort combined with d3.ascending and d3.descending to create a new sorted dataset
  // JavaScript has its own Array.sort function that sorts an array in place. d3.sort actually returns a new array and accepts a comparator or an accessor.
  // D3.ascending and d3.descending are actual comparators and are usually combined with d3.sort.
  // - First create an array of only income values using dataset.map. Then use d3.sort and pass d3.descending as the comparator to sort it.
  // - We would like to get our whole dataset sorted. Use d3.sort on our whole dataset. Try to use the d3.ascending comparator by calling it manually: d3.ascending(a.income, b.income) 
  // - inspect the results in the browser debugging tools
  const incomes = dataset.map((d) => d.income);
  const descending = d3.sort(incomes, d3.descending);
  const ascending = d3.sort(dataset, (a, b) => d3.ascending(a.income, b.income));

  // TODO: 2.4 use transformation function d3.groups to transform our dataset into nested array's.
  // D3 transformation functions take your dataset and transform them into a format that is more easy to use with selections, nested selections and other D3 functionality. 
  // transformation function usually take a (flat) array as input argument together with one or more accessors, comparators or even reducers.
  // the d3.groups function first takes the dataset as argument and then an arbitrary number of accessor functions, that must return a property of datum which will act as the key to group our data by.
  // - inspect the result in the browser debugging tools after every step
  // - use d3.groups to group our dataset by customer. Use the categoryaccessor function.
  // - uncomment the datatitem with id 21 in our dataset. Now provide another (second) accessor argument that returns the month key (serieAccessor).
  // - change the order of the key accessors
  // - notice in the result that the first item in every array represents the group 'key' and the second entree the group itself
  const groupedByCustomer = d3.groups(dataset, categoryAccessor);
  const groupedByCustomerByMonth = d3.groups(dataset, categoryAccessor, serieAccessor);
  const groupedByMonthByCustomer = d3.groups(dataset, serieAccessor, categoryAccessor);

  // TODO: 2.5 use set functions difference, union and intersection to merge arrays and filter for distinct values.
  // d3.difference returns a new D3 InternSet containing every value in the first array that is not in any of the others arrays.
  // d3.union returns a new D3 InternSet containing every distinct value that appears in ANY of the given arrays.
  // d3.intersection returns a new D3 InternSet containing every distinct value that appears in ALL of the given arrays.
  // - see if you can guess what the results will be of every step before you inspect the results in the browser debugging tools
  // - use d3.difference and pass array1 and array2 as arguments
  // - use d3.union and pass array2 and array3 as arguments
  // - use d3.intersection and pass array1, array2 and array3 as arguments
  const array1 = [0, 1, 2, 3, 5, 0];
  const array2 = [2, 3, 4, 5];
  const array3 = [0, 5, 6];

  const difference = d3.difference(array1, array2);
  const union = d3.union(array2, array3);
  const intersection = d3.intersection(array1, array2, array3);

  // TODO: 2.6 use d3.format to format number values into human readable strings
  // It's all about the numbers, but they can make your head spin if they are not formatted properly.
  // The d3.format function takes a formatting string specifier and returns a formatter function.
  // This formatter function then takes a number and converts it into a string in the provided format.
  // For example if we are dealing with percentages we might want to always show one decimal number and a percentage suffix (50,7%),
  // Or if we are showing financial data we want a currency prefix, no decimals and a '-' suffix ($1234,-)
  // We use this for example when creating the y-axis or showing values in a tooltip
  // - use d3.format to create a formatter function that turns number's into a dollar string. use format '$,.2f'
  // - use your dollar formatter to format the number 0.35, 1000 and 2500000
  // - use d3.format to create a formatter function that turns number's into a percentage string with max one decimal
  //   see if you can create the specifier yourself using the below explanation
  // - use your percentage formatter to format the numbers 0.25, 50.7 and 99.9
  // Note: d3 formatting type percentage multiplies the value by 100 and adds the % suffix

  // explaining the dollar format '$,.2f' (at least trying to): 
  // - the '$' means we are formatting currency
  // - the ',' means use the thousands separator
  // - the '.2' means use decimals with a precision of 2
  // - the 'f' means use a fixed point notation
  const formatDollars = d3.format('$,.2f');
  const thousandDollars = formatDollars(1000);

  const formatPercentage = d3.format(',.1%');
  const percent = formatPercentage(50.7 / 100);

  // Sidenote: the actual characters that are used for currency, thousands and decimal are defined in a locale.
  // if we want to use euros instead of dollars with d3.format we need to create a D3 locale.
  // const nlLocale = d3.formatLocale({
  //   decimal: ",",
  //   thousands: ".",
  //   grouping: [3],
  //   currency: ["€", ",-"]
  // });
  // const formatEuros = nlLocale.format('$,.0f');
  // const thousandEuros = formatEuros(1000);
}

/**
 * You've already seen the chaining syntax when using selections, 
 * but D3 actually uses chaining syntax everywhere.
 * You can even create you own function with which you can keep the chain going.
 * Below are a couple of pseudo code examples of chaining up all the things with D3.
 */
function methodChaining() {
  function plusOne() {

  }

  // chaining with selections we already know
  d3.selectAll('rect')
    .data([])
    .enter()
    .append('rect')
    .attr('x', d => d.value)
    .attr('y', d => d.value);

  // selections can be nested, also with chaining
  d3.select('#something')
    .selectAll('g')
    .data([])
    .join('g')
    .attr('class', 'groupie')
    .selectAll('rect')
    .data(d => [d])
    .attr('x', 1)
    .attr('y', 1);

  d3.selectAll('g.groupie')
    .selectAll('text')
    .data(d => [d])
    .join('text')
    .text(d => d.label);

    

}


/**
 * Besides the data transformation and calculation utils, 
 * D3 provides functionality that can be divided into three categories: generators, components, and layouts (see the png image in the _assignment folder).
 *  - D3 generators take data and return the necessary SVG drawing code to create a graphical object based on that data. For instance, if you have an array of points and you want to draw a line from one point to another.
 *  - D3 components create an entire set of graphical objects necessary for a particular chart component. The most commonly used D3 component is d3.axis, creating a chart axis.
 *  - D3 layouts can be straightforward (piechart layout) or complex (force directed network layout). Layouts take in one or more arrays of data, and sometimes generators, and append attributes to the data necessary to draw certain positions or sizes, preparing the data to draw certain types of visuals or even whole charts.  
 * You don't need to know exactly how they work, but you will use them when creating charts with D3, so it is useful to know they exist and what the differences are.
*/
function generatorsComponentsLayouts() {
  const svg = d3.select('#gcl');
  const {
    valueAccessor, formattedValueAccessor,
    categoryAccessor, xAccessor, serieAccessor,
    widthAccessor, heightAccessor, yAccessor, colorAccessor
  } = accessorFunctions();

  // line generator
  const BizSuppliesIncomePerDay = [
    { id: 1, date: '2022-08-15', income: 2000 }, { id: 2, date: '2022-08-16', income: 2500 },
    { id: 3, date: '2022-08-17', income: 2300 }, { id: 4, date: '2022-08-18', income: 2600 },
    { id: 5, date: '2022-08-19', income: 1900 }, { id: 6, date: '2022-08-20', income: 2222 },
    { id: 7, date: '2022-08-21', income: 2323 }, { id: 8, date: '2022-08-22', income: 2523 },
    { id: 9, date: '2022-08-23', income: 2002 }, { id: 10, date: '2022-08-24', income: 1750 },
    { id: 11, date: '2022-08-25', income: 1945 }, { id: 12, date: '2022-08-26', income: 2900 },
    { id: 13, date: '2022-08-27', income: 1600 }, { id: 14, date: '2022-08-28', income: 2142 },
    { id: 7, date: '2022-08-29', income: 2313 }, { id: 8, date: '2022-08-30', income: 2553 },
  ];
  const maxBizSuppliesIncome = d3.max(BizSuppliesIncomePerDay, valueAccessor);

  // TODO 2.1: use d3 line generator to create the command string for a svg path element
  // Drawing svg lines with D3 is usually done with the svg path element.
  // Luckily D3 provides us with a line generator that creates the command string, so we don't have to write it manually.
  // The d3.line function returns a generator that can then be feed with data to create the command string.
  // By default the data needs to be an array of arrays with coordinates x and y --> [ [x0, y0], [x1, y1], [x2, y2] ]
  // To make things easier, the line generator has two methods x and y with which you can set the data accessors for x and y coordinates.
  // You can also use chaining syntax when setting the x and y accessors --> d3.line().x(...).y(...).
  // - create a d3 line generator
  //  - set its x accessor to return i * width / BizSuppliesWeekData.length
  //  - set its y accessor to call our reusable yAccessor
  // - use the generator with the BizSuppliesData to calculate a path command string
  // - now append a path to the svg, use the command string as value for d and set the attrs fill, stroke and stroke-width.
  //   you should see a (pretty boring) nearly straight line going up.
  const lineGenerator = d3.line()
    .x((d, i) => i * width / BizSuppliesIncomePerDay.length)
    .y((d, i, nodes) => yAccessor(d, i, nodes, height, maxBizSuppliesIncome));
  const path = lineGenerator(BizSuppliesIncomePerDay);

  svg.append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2);


  // domain between which a scale can operate/interpolate
  const domain = [d3.max(BizSuppliesIncomePerDay, (d) => d.income), 0];
  // the available range in pixels a scale has
  const range = [0, height];
  // the scale used to calculate y position of a point
  const yScale = d3.scaleLinear().domain(domain).range(range);

  // TODO 2.1: use d3 axisRight component to generate all svg elements for a complete axis
  // Some parts of a chart are so common that d3 provides functionality to generate them for you, the most obvious one being the x and y axis.
  // An axis needs to be provided with a d3 scale to calculate how it should draw itself, which is already provided above.
  // - call d3.axisRight function and provide the yScale as argument. It will return a axis component.
  // You can append the axis to a svg or group element by calling the component and passing an svg element. D3 will append the append the axis to the element.
  // - call the component and provide the svg as and argument. Our svg will now display an axis.
  // I know it looks ugly in many ways, but we will leave it for now and look at scales and axis in detail in the next repository.
  // The important thing is you realize what axisRight and other D3 components do.
  const yAxis = d3.axisRight(yScale);
  yAxis(svg);

  // TODO 2.1: use d3 histogram layout to create a dataset that you can use to easily create a histogram / columnchar
  // Charts can get increasingly more complex when datasets get bigger, more hierarchical and complexer themselfs.
  // D3 provides several layout functions that make it easier to create certain types of charts.
  // One of the more simpeler ones is the histogram chart, closely related to the column chart.
  // A histogram shows the frequency of a value within a certain interval or range.
  // With BizSuppliesIncomePerDay you can for example count the number of days (frequency) that had an income between 1600 and 1800 (interval/range), between 1800 and 2000, between 2000 and 2200 etc.
  // First we need to define a 'domain' that defines the min and max values the histogram operates in.
  // - use d3 extent to find the min and max income of BizSuppliesIncomePerDay, this will be our domain.
  // - create a histogram object using d3.histogram()
  // - set the histogram object's .domain(..) and specify how to find the value (income) in our data using the .value((d) => ..) function. You can use method chaining.
  // - call the histogram function with the BizSuppliesIncomePerDay to create the histogram data layout
  // - use the debugger tools to see the data layout that the histogram function returned
  // Notice that the data is an array of arrays and has been grouped into intervals, for example x0=1600 and x1=1800. All the days that had an income between 1600 and 1800 are found in that array.
  // You will find out how to actually use this data to create a chart in another repository.
  const histoDomain = d3.extent(BizSuppliesIncomePerDay, (d) => d.income);
  const histogram = d3.histogram();
  histogram.domain(histoDomain).value((d) => d.income);
  const histoData = histogram(BizSuppliesIncomePerDay);
}

/**
 * * Grouping data and elements is a good practice for a couple of reasons.
 * - the most obvious is semantics, it's easier to read the DOM when elements are grouped together
 * - groups can be 'transformed' as a whole, for example translating the group to the left, right, up or down
 * - g elements don't have attributes or properties itself, but it's child elements do inherit properties that are set on the g element. 
 *   For example you can set the 'fill' on a g element to red, and all child elements will inherit by default.
 * - working with groups can make it easier when databinding to selections and nestedselections
 */
function groupingAndNesting() {
  const svg = d3.select('#groupingnesting');

  // re-use the accessor functions
  const {
    valueAccessor, formattedValueAccessor,
    categoryAccessor, serieAccessor, xAccessor,
    widthAccessor, heightAccessor, yAccessor, colorAccessor
  } = accessorFunctions();

  const maxIncome = d3.max(dataset, valueAccessor);
  const lineGenerator = d3.line()
    .x((d, i) => i * 100)
    .y((d, i, nodes) => yAccessor(d, i, nodes, height, maxIncome));


  // TODO: 2.1 Draw all path lines by grouping the data by series
  // You previously used the d3 line generator to draw a line for the sep-16 data. let's create a line for each month (serie) and draw them in one chain.
  // - first group the dataset by serie using the d3.groups transformation function
  // - then select all paths in the svg and bind the data to it. enter and append path
  // - now you have access to a serie per iteration, so d is actually a group
  //   remember what a group is formatted like? [0] is the key and [1] is the actually data
  //   set attr d by calling the lineGenerator with the actual data (d[1])
  // - set the stroke attr (color) using the colorAccessor. Use the month (group key ==> d[0]) as argument for the colorAccessor
  // - set attr fill to none and stroke-width to 2
  const groupedSerieData = d3.groups(dataset, serieAccessor);
  svg.selectAll('path')
    .data(groupedSerieData)
    .enter()
    .append('path')
    // .attr('transform', (d, i) => `translate(${xAccessor(d, i)}, 0)`) // adjust lines to touch bars (not correct because using different scales! (time and category)
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke', (d, i, nodes) => colorAccessor(d[0]))
    .attr('d', (d, i, nodes) => lineGenerator(d[1], i, nodes));

  // TODO: 2.2 Draw columns grouped by customer (category) by grouping the data by category and using nesting elements and selections
  // instead of grouping our data and visuals by month we can also group and display it by customer (category).
  // displaying by category is usually done with bars and columns, so let's create some grouped columns,
  // - first you need to use d3.groups again but use the categoryAccessor instead
  // - inspect the result in debugger tools. Notice that our groups consist of a key d[0] and the actual group data d[1]
  // Instead of directly binding our data to rects, we use g elements to group our rects and bind our grouped data to.
  // - select all g elements in the svg and bind the groupedCategoryData to the selection, then enter and append g
  // - now select all rects inside the appended g elements, creating a nested selection (see _materials/nested-selection.png)
  // - bind data to the nested selection by supplying an anonymous (accessor) function as argument for data()
  //   and returning the actual group data (all the months for a single customer) in the current group with d[1]
  // - enter and append rect. Now we have appended a g element for each customer and inside that g element a rect element for each month.
  // - finish the columns by setting its attrs x, width, fill, y and height. Use the re-useable accessor functions (d is the actual data item now).
  // Now you will probably see only one group of columns. This is because we position our rects inside each group element exactly the same.
  // This is where the g element shines, because we can just translate each group to it's own x position.
  // - add an attr 'transform' to the g elements (after append) and set its value to `translate(${i * 100}, 0)` which will move the group to a calculated x position.
  // Note: currently we use a 'fake' calculation based on index to get the group x position. Normally we would use D3 scales for this.
  const groupedCategoryData = d3.groups(dataset, categoryAccessor);
  svg.selectAll('g')
    .data(groupedCategoryData)
    .enter().append('g')
    .attr('transform', (d, i) => `translate(${i * 100}, 0)`)
    .selectAll('rect')
    .data(d => d[1])
    .enter().append('rect')
    .attr('x', xAccessor)
    .attr('width', widthAccessor)
    .attr('fill', (d) => colorAccessor(d.month))
    .attr('y', (d, i, nodes) => yAccessor(d, i, nodes, height, maxIncome))
    .attr('height', (d, i, nodes) => heightAccessor(d, i, nodes, height, maxIncome));
}

//###### readonly ######

function createSVGSVGElement(width, height, id) {
  // select the element you want to add our svg graphic to, our root div 
  const rootSelection = d3.select('#root');
  // append an svg element to our root element with D3
  const svgSelection = rootSelection.append('svg');

  // using chaining syntax
  svgSelection.attr('id', id)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  return svgSelection;
}

// a copy of the data that can be seen in the 'parts of a chart.png'
const dataset = [
  { id: 1, month: 'Sep-16', customer: 'BizSupplies', income: 69000 },
  { id: 2, month: 'Sep-16', customer: 'Dynamic Attire', income: 60000 },
  { id: 3, month: 'Sep-16', customer: 'Harmonic Sonics', income: 61000 },
  { id: 4, month: 'Sep-16', customer: "Plumb'n'Stuff", income: 66000 },
  { id: 5, month: 'Sep-16', customer: 'Other', income: 34000 },
  { id: 6, month: 'Dec-16', customer: 'BizSupplies', income: 71000 },
  { id: 7, month: 'Dec-16', customer: 'Dynamic Attire', income: 59000 },
  { id: 8, month: 'Dec-16', customer: 'Harmonic Sonics', income: 64000 },
  { id: 9, month: 'Dec-16', customer: "Plumb'n'Stuff", income: 71000 },
  { id: 10, month: 'Dec-16', customer: 'Other', income: 44000 },
  { id: 11, month: 'Mar-17', customer: 'BizSupplies', income: 73000 },
  { id: 12, month: 'Mar-17', customer: 'Dynamic Attire', income: 61000 },
  { id: 13, month: 'Mar-17', customer: 'Harmonic Sonics', income: 63000 },
  { id: 14, month: 'Mar-17', customer: "Plumb'n'Stuff", income: 74000 },
  { id: 15, month: 'Mar-17', customer: 'Other', income: 46000 },
  { id: 16, month: 'Jun-17', customer: 'BizSupplies', income: 76000 },
  { id: 17, month: 'Jun-17', customer: 'Dynamic Attire', income: 65000 },
  { id: 18, month: 'Jun-17', customer: 'Harmonic Sonics', income: 66000 },
  { id: 19, month: 'Jun-17', customer: "Plumb'n'Stuff", income: 76000 },
  { id: 20, month: 'Jun-17', customer: 'Other', income: 45000 }
  //, { id: 21, month: 'Jun-17', customer: 'Other', income: 20000 }
];

const width = 600, height = 400;
const svgGeneratorsComponentsLayouts = createSVGSVGElement(width, height, 'gcl');
const svgGroupingNesting = createSVGSVGElement(width, height, 'groupingnesting');

accessorFunctions();
dataManipulationUtils();
methodChaining();
generatorsComponentsLayouts();
groupingAndNesting();




//###### end readonly ######





