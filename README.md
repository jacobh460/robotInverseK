I originally created this for my school's FTC team as this year we are using a setup where we have an arm with two joints mounted at the end of a linear slide. However, this is overkill for our application so we likely won't end up using this but it was still a fun project to make. It is a bit buggy sometimes as I haven't had time to work on this anymore. I also didn't use a ui library like react which I am regretting.

The main idea is that you can define the points for a parametric natural cubic spline ([see wikipedia](https://en.wikipedia.org/wiki/Spline_interpolation)) and have the robot arm follow this path.
Originally I was trying to use bezier curves but switched to natural cubic splines.

You can see a live preview [here](https://jacobh460.github.io/robotInverseK/)

Controls:
- Hold middle mouse button and drag to pan
- Scroll to zoom in/out
- Add points by pressing the plus button on the right
- Q turns on trace which draws a line showing the path the robot arm will actually take (as opposed to the spline which the arm sometimes cannot reach)
- W highlights the area the arm can reach anywhere within