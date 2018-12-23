import sys
import os
import json
import glob
import mmap


def getFiles(path, containing):
    answer = glob.glob(path, recursive=True)
    contains = []

    searching = {"type": "searching", "searching": len(answer)}
    print(json.dumps(searching, default=lambda o: o.__dict__))

    sizeSearched = 0
    sizeFound = 0

    if containing == "":
        for file in answer:
            info = os.stat(file)
            sizeSearched += info.st_size
            sizeFound += info.st_size

            filename, file_extension = os.path.splitext(file)
            directory = os.path.dirname(file)
            obj = {
                "type": "file",
                "file": file,
                "filename": file.replace(directory, '')[1:],
                "directory": directory,
                "extension": file_extension,
                "stats": {
                    "size": info.st_size,
                    "access": info.st_atime,
                    "modified": info.st_mtime
                }
            }
            print(json.dumps(obj, default=lambda o: o.__dict__))

        queryInfo = {
            "type": "info",
            "searchedSize": sizeSearched,
            "foundSize": sizeFound,
            "searchedCount": len(answer),
            "foundCount": len(answer)
        }
        print(json.dumps(queryInfo, default=lambda o: o.__dict__))

        return

    for file in answer:
        try:
            with open(file, 'rb', 0) as f, \
                    mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as s:

                info = os.stat(file)
                sizeSearched += info.st_size

                if s.find(str.encode(containing)) != -1:
                    contains.append(file)

                    sizeFound += info.st_size
                    filename, file_extension = os.path.splitext(file)
                    directory = os.path.dirname(file)
                    obj = {
                        "type": "file",
                        "file": file,
                        "filename": file.replace(directory, '')[1:],
                        "directory": directory,
                        "extension": file_extension,
                        "stats": {
                            "size": info.st_size,
                            "access": info.st_atime,
                            "modified": info.st_mtime
                        }
                    }
                    print(json.dumps(obj, default=lambda o: o.__dict__))

                else:
                    obj = {
                        "type": "count",
                        "count": 1,
                        "file": file
                    }
                    print(json.dumps(obj, default=lambda o: o.__dict__))
        except BaseException:
            pass
            # print("Couldn't open file... oh well")

    queryInfo = {
        "type": "info",
        "searchedSize": sizeSearched,
        "foundSize": sizeFound,
        "searchedCount": len(answer),
        "foundCount": len(contains)
    }
    print(json.dumps(queryInfo, default=lambda o: o.__dict__))


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
