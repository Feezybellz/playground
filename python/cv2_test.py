import cv2

# Initialize the video capture
cap = cv2.VideoCapture(0)

# Define the codec and create VideoWriter object
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640, 480))

while(cap.isOpened()):
    ret, frame = cap.read()
    if ret:
        # Write the flipped frame
        out.write(frame)

        # Display the resulting frame
        cv2.imshow('frame', frame)

        # Break the loop on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

# Release everything when done
cap.release()
out.release()
cv2.destroyAllWindows()



# import cv2
#
# vid = cv2.VideoCapture(0)
# vid.set(3,200)
# vid.set(4,200)
#
# while(True):
#     #inside infinity loop
#     ret, frame = vid.read()
#     cv2.imshow('frame', frame)
#     print(ret)
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break
#
#
# vid.release()
# # Destroy all the windows
# cv2.destroyAllWindows()
