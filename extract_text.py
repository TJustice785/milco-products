import xml.etree.ElementTree as ET
import sys

def extract_text(xml_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        # Word XML namespaces
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        texts = []
        for p in root.findall('.//w:p', ns):
            p_text = ""
            for t in p.findall('.//w:t', ns):
                if t.text:
                    p_text += t.text
            if p_text.strip():
                texts.append(p_text.strip())
        
        return "\n".join(texts)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(extract_text(sys.argv[1]))
