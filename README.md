I originally created this for my school's FTC team as this year we are using a setup where we have an arm with two joints mounted at the end of a linear slide. However, this program is overkill for our application so we likely won't end up using it but it was still a fun project to make. It is a bit buggy sometimes as I haven't had time to work on this anymore. I also didn't use a ui library like react, which I am regretting, though I thoroughly enjoyed working on this project.

The main idea is that you can define the points for a parametric natural cubic spline ([see wikipedia](https://en.wikipedia.org/wiki/Spline_interpolation)) and have the robot arm follow this path.
Originally I was trying to use bezier curves but switched to natural cubic splines.

This project can be interacted with here (you need to use a mouse on computer; trackpad is insufficient): https://jacobh460.github.io/robotInverseK/

Controls:
- Hold middle mouse button and drag to pan
![opera_D86ZzzifzT](https://github.com/user-attachments/assets/7794b5d4-5863-4e5d-b25e-f982ee5d9f2d)
- Scroll to zoom in/out
![opera_6sC05jHArV](https://github.com/user-attachments/assets/d5b7b337-ecbe-4763-84db-c91c50c917ea)
- Add handles by pressing the lower plus button on the right
![opera_Z4aV8j1qlY](https://github.com/user-attachments/assets/6a98b546-1f4e-4726-81e4-ed1b5be1eddf)
- W highlights the area the arm is capable of reaching in green
![opera_k03YDVPCCA](https://github.com/user-attachments/assets/d6ba7d2d-e985-44c1-af8b-ad7665fc9271)
- Q turns on trace which draws a line (yellow) showing the path the robot arm will actually take (as opposed to the spline which the arm sometimes cannot reach)
![opera_4WN6KUTghU](https://github.com/user-attachments/assets/24c68e6b-401d-4fd2-8d4f-ed6d3f4f59ef)
- Drag the slider left and right to move the end effector along the spline
![opera_jHg9z5yv71](https://github.com/user-attachments/assets/0f018110-7781-4731-9bd6-ff5e1153856c)
- Extra constraints may be added at specific handles for end effector angle (theta_b) or lift length (l1). Attempting to constrain both overdefines the system. For example, constraining theta_b at the last handle:
![chrome_WvLyDnhfOX](https://github.com/user-attachments/assets/d2e60719-0dff-49d2-bcfb-57ae09488b2b)
