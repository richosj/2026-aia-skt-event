"""
OTF/TTF → WOFF2 변환 (fontTools 필요: pip install fonttools brotli)
프로젝트 루트에 원본 파일을 두고 실행: python convert.py
결과는 public/fonts/ 에 저장됩니다.
"""
import os

from fontTools.ttLib import TTFont

OUT_DIR = os.path.join("public", "fonts")

# 원본 파일명 → 변환 파일명 (루트에 원본이 있을 때)
files = {
    # Pretendard — 공식 ZIP에 포함되는 파일명 예시
    "Pretendard-Regular.otf": "Pretendard-Regular.woff2",
    "Pretendard-Medium.otf": "Pretendard-Medium.woff2",
    "Pretendard-SemiBold.otf": "Pretendard-SemiBold.woff2",
    "Pretendard-Bold.otf": "Pretendard-Bold.woff2",
    # Paperlogy — 배포 TTF/OTF 명칭 예시 (fonts-archive 등)
    "Paperlogy-4Regular.otf": "Paperlogy-4Regular.woff2",
    "Paperlogy-4Regular.ttf": "Paperlogy-4Regular.woff2",
    "Paperlogy-6SemiBold.otf": "Paperlogy-6SemiBold.woff2",
    "Paperlogy-6SemiBold.ttf": "Paperlogy-6SemiBold.woff2",
    "Paperlogy-7Bold.otf": "Paperlogy-7Bold.woff2",
    "Paperlogy-7Bold.ttf": "Paperlogy-7Bold.woff2",
}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    for input_name, output_name in files.items():
        out_path = os.path.join(OUT_DIR, output_name)
        if not os.path.exists(input_name):
            continue
        try:
            font = TTFont(input_name)
            font.flavor = "woff2"
            font.save(out_path)
            print(f"변환 성공: {out_path}")
        except Exception as e:
            print(f"변환 실패 ({input_name}): {e}")

    skipped = [k for k in files if not os.path.exists(k)]
    if skipped:
        print(
            f"건너뜀(파일 없음, 이미 woff2를 쓰는 경우 정상): {len(skipped)}개"
        )


if __name__ == "__main__":
    main()
