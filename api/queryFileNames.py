import sys
import os
import json
import glob
import mmap
import re
import contextlib


def getFiles(path, containing):
    answer = glob.glob(path, recursive=True)
    contains = []
    # print(len(answer))
    for file in answer:
        try:
            with open(file, 'rb', 0) as f, \
                    mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as s:

                if s.find(str.encode(containing)) != -1:
                    contains.append(file)
                    info = os.stat(file)
                    filename, file_extension = os.path.splitext(file)
                    directory = os.path.dirname(file)
                    obj = {
                        "file": file,
                        "filename": file.replace(directory + '/', ''),
                        "directory": directory,
                        "extension": file_extension,
                        "stats": {
                            "size": info.st_size,
                            "access": info.st_atime,
                            "modified": info.st_mtime
                        }
                    }
                    print(json.dumps(obj, default=lambda o: o.__dict__))
        except BaseException:
            pass
            #print("Couldn't open file... oh well")

    return {
        "count": len(contains),
        "searched": len(answer),
        "files": contains
    }


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from
    # that
    return json.loads(lines[0])


def main():
    lines = read_in()

    # print(lines["command"])

    if lines["command"] == "getFiles":
        full = lines["path"] + lines["glob"]
        containing = lines["containing"]
        # print(full)
        getFiles(full, containing)


if __name__ == '__main__':
    main()
