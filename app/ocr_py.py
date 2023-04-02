import easyocr
reader = easyocr.Reader(['en'], gpu=False)
results = reader.readtext(
    '/home/chiragsp/Documents/Code/angular-electron/temp/aadhar_prathmesh.png')
print(results)
