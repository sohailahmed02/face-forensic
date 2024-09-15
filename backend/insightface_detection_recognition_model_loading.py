import os
import model_zoo



def detection_recognition_model():

    # providers  = ['CUDAExecutionProvider', 'CPUExecutionProvider'] UserWarning: Specified provider 'CUDAExecutionProvider' is not 
# in available provider names.Available providers: 'AzureExecutionProvider, CPUExecutionProvider'
    providers  = ['AzureExecutionProvider', 'CPUExecutionProvider']
    provider_options =None
    path = "buffalo"
    onnx_files = os.listdir(path)       #list all onxx path in directory
    print("ONXX model files: \n" , onnx_files)
    allowed_modules=None
    models = {}

    for onnx_file in onnx_files:
        onnx_path     = os.path.join(path,onnx_file)
        model_class   = model_zoo.ModelRouter(onnx_path)
        model= model_class.get_model(providers=providers, provider_options=provider_options)
        print('find model:', onnx_file,model.taskname, model.input_shape, model.input_mean, model.input_std)
        models[model.taskname] = model
        print(model.taskname , 'model loaded')

    detection_model     = models['detection']
    recognition_model   = models['recognition']
    # genderage_model     = models["genderage"]

    detection_model.prepare(ctx_id=0,det_thresh=0.3)
    recognition_model.prepare(ctx_id=0)
    # genderage_model.prepare(ctx_id=0)

    return detection_model, recognition_model,


# detection_recognition_model()