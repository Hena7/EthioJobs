import re
import os

files_to_update = [
    'frontend/src/app/(main)/page.tsx',
    'frontend/src/app/auth/layout.tsx'
]

video_replacements = {
    "https://cdn.pixabay.com/video/2021/08/18/85429-590038848_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://cdn.pixabay.com/video/2021/02/10/64700-510850259_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://cdn.pixabay.com/video/2020/05/11/38914-421714881_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://cdn.pixabay.com/video/2019/11/13/29032-372990666_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://cdn.pixabay.com/video/2018/11/27/19441-303723707_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://cdn.pixabay.com/video/2016/09/21/5398-183786499_large.mp4": "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
}

for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()

    for old, new in video_replacements.items():
        content = content.replace(old, new)

    with open(filepath, 'w') as f:
        f.write(content)
