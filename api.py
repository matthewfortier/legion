import sys
import json
import glob
import mmap


def getFiles(path, containing):
    answer = []
    endPaths = glob.glob(path, recursive=True)
    answer += endPaths

    contains = []
    print(len(answer))
    for file in answer:
        try:
            with open(file, 'rb', 0) as f, \
                    mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as s:

                if s.find(str.encode(containing)) != -1:
                    contains.append(file)
                    print(file)
        except:
            print("Couldn't open file... oh well")

    return {
        "count": len(contains),
        "searched": len(answer),
        "files": contains
    }

# print(getFiles("C:\\Source\\Noting\\"))


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    lines = read_in()

    print(lines["command"])

    if lines["command"] == "getFiles":
        full = lines["path"] + lines["glob"]
        containing = lines["containing"]
        print(full)
        getFiles(full, containing)


if __name__ == '__main__':
    main()
