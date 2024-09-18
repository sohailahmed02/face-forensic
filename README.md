# face-forensic

This application front end is based on nextjs and frontend is based on FASTAPI. Neon SQL database is used for storage. this application use opensource face analysis modules/weights. app key features are:

FACE DETECTION:
Detects multiple faces in a picture.
Provides face embeddings, face pose, and key face positions.
Adjustable detection threshold

RECOGNITION:
Recognizes faces using stored data in the database.
Provides recognition scores.
LIVE CAM:
Supports camera stream for real-time face detection and recognition.
<br>
## <a name="application block diagram"></a>🎉 block diagram
<p align="center">
    <img src="shots/block.jpg"/>
<p>
<br>


## <a name="Face Detection"></a>🎉 Face Detection Model
* RetinaFace is a practical single-stage face detector which is accepted by CVPR 2020. We provide training code, training dataset, pretrained models and evaluation scripts. [RetinaFace (CVPR'2020)](https://github.com/deepinsight/insightface/blob/master/detection/retinaface).
<img src="https://camo.githubusercontent.com/a66df98f6c12c96f9e310f93c64ca60c0fb9a5e08606bb1b9f5137bf6957a960/68747470733a2f2f696e7369676874666163652e61692f6173736574732f696d672f6769746875622f31313531334430352e6a7067"/>

## <a name="Face Recognition"></a>🎉 Face Recognition Model
* commonly used network backbones are included in most of the methods, such as IResNet, MobilefaceNet, MobileNet, InceptionResNet_v2, DenseNet, etc... [ArcFace_mxnet (CVPR'2019)](https://github.com/deepinsight/insightface/blob/master/recognition/arcface_mxnet).
<img src="https://camo.githubusercontent.com/b32afa5e02863b14f2ed1c1b5ef8a5795a82e69c8832c2fe9fdc0a442a24f76c/68747470733a2f2f696e7369676874666163652e61692f6173736574732f696d672f6769746875622f666163657265636f676e6974696f6e66726f6d766964656f2e504e47"/>

## <a name="Pretrained Models"></a>🎉 Pretrained Models
*Please check [Model-Zoo](https://github.com/deepinsight/insightface/wiki/Model-Zoo) for more pretrained models.

## <a name="Demo"></a>🎉Demo
<p align="center">
    <img src="shots/7.jpg"/>
<p>
    <p align="center">
    <img src="shots/face1.jpg"/>
<p>
    <p align="center">
    <img src="shots/face2.jpg"/>
<p>

<p align="center">
    <img src="shots/face3.jpg"/>
<p>
<p align="center">
    <img src="shots/face4.jpg"/>
<p>
