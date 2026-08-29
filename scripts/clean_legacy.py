from pathlib import Path

root = Path("docs/learn")
allowed = {"index","java-core","oop","collections","generics","exceptions","jvm","multithreading","java8","functional","stream-api","io","sql","databases","orm","spring","web","testing","patterns","microservices","kafka","nosql","logging","deploy","reactive","algorithms","other"}
removed=[]
for p in root.glob("*.md"):
    if p.stem not in allowed:
        p.unlink(); removed.append(str(p))
for old in ["html","uml","xml","css","zhukov","enhorse","table","concurrency"]:
    d=Path("docs")/old
    if d.is_dir():
        import shutil; shutil.rmtree(d); removed.append(str(d))
print("Removed legacy files:", len(removed))
for x in removed: print("-",x)
